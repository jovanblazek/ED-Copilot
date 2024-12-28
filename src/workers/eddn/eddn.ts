import { Worker } from 'worker_threads'
import path from 'path'
import logger from '../../utils/logger'
import { SystemProcessingQueue } from '../../mq/queues/systemProcessing'
import { EDDNEventToProcess } from '../../types/eddn'

const SYSTEM_PROCESS_JOB_NAME = 'system-processing'
const FILE_NAME = 'eddnWorker.js'

export default function startEDDNWorker() {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error('EDDN worker is only available in production')
  }

  const worker = new Worker(path.join(__dirname, FILE_NAME))
  
  worker.on('online', () => {
    logger.info('EDDN worker online')
  })

  worker.on('message', async (eddnEventToProcess: EDDNEventToProcess) => {
    await SystemProcessingQueue.add(
      `${SYSTEM_PROCESS_JOB_NAME}:${eddnEventToProcess.StarSystem}`,
      eddnEventToProcess
    )
  })

  worker.on('error', (error) => {
    logger.error(error, 'EDDN worker error')
    // Don't restart on error when shutting down
    if (!worker.threadId) {
      return
    }
    startEDDNWorker()
  })

  worker.on('exit', (code) => {
    logger.info(`EDDN worker stopped with exit code ${code}`)
    if (code !== 0 && worker.threadId) {
      logger.error(`EDDN worker stopped with exit code ${code}`)
      startEDDNWorker()
    }
  })

  const shutdown = async () => {
    logger.info('Shutting down EDDN worker...')
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('EDDN worker shutdown timeout'))
      }, 5000)

      worker.once('message', (message) => {
        if (message === 'shutdown_complete') {
          clearTimeout(timeout)
          resolve()
        }
      })

      worker.once('error', (error) => {
        clearTimeout(timeout)
        reject(error)
      })

      worker.postMessage('shutdown')
    })
  }

  return { worker, shutdown }
}
