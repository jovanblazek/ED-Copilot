import { ChildProcess, fork } from 'child_process'
import path from 'path'
import { SystemProcessingQueue } from '../mq/queues/systemProcessing'
import { EDDNEventToProcess } from '../types/eddn'
import logger from '../utils/logger'

const SYSTEM_PROCESS_JOB_NAME = 'system-processing'
const FILE_NAME = 'eddnProcess.js'
const MAX_RESTARTS = 3

const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const IS_DEBUG_EDDN_WORKER = process.env.DEBUG_EDDN_WORKER === 'true'

export default function startEDDNListenerProcess() {
  if (!IS_PRODUCTION && !IS_DEBUG_EDDN_WORKER) {
    throw new Error('EDDN listener is only available in production')
  }

  let process: ChildProcess | null = null
  let restartCount = 0
  let isShuttingDown = false

  const start = () => {
    process = fork(path.join(__dirname, FILE_NAME))

    process.on('spawn', () => {
      logger.info('[EDDN Listener] Listener process spawned')
    })

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    process.on('message', async (eddnEventToProcess: EDDNEventToProcess) => {
      if (eddnEventToProcess?.StarSystem) {
        await SystemProcessingQueue.add(
          `${SYSTEM_PROCESS_JOB_NAME}:${eddnEventToProcess.StarSystem}`,
          eddnEventToProcess
        )
      }
    })

    process.on('exit', (code) => {
      if (!isShuttingDown && code !== 0 && code !== null && restartCount < MAX_RESTARTS) {
        logger.warn(
          `[EDDN Listener] Process exited with code ${code} (restart ${restartCount + 1}/${MAX_RESTARTS})`
        )
        restartCount += 1
        start()
      }
    })
  }

  const shutdown = () => {
    if (!process) {
      logger.warn('[EDDN Manager] Shutdown requested but no active process')
      return
    }
    isShuttingDown = true
    logger.info('[EDDN Manager] Initiating graceful shutdown of listener process')

    // eslint-disable-next-line consistent-return
    return new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        if (process) {
          process.kill('SIGKILL')
        }
        resolve()
      }, 5000)

      if (process && process.connected) {
        process.once('message', (message) => {
          if (message === 'shutdown_complete') {
            clearTimeout(timeout)
            resolve()
          }
        })
        process.send('shutdown')
      } else {
        // If process is not connected, resolve immediately
        clearTimeout(timeout)
        resolve()
      }
    })
  }

  start()
  return { process, shutdown }
}
