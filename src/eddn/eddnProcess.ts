import { Subscriber } from 'zeromq'
import zlib from 'zlib'
import { EDDNConflict, EDDNEventToProcess, EDDNFaction } from '../types/eddn'
import logger from '../utils/logger'
import { HttpsEddnEdcdIoSchemasJournal1 } from './types'

const EDDN_URL = 'tcp://eddn.edcd.io:9500'
const JOURNAL_EVENT_SCHEMA = 'https://eddn.edcd.io/schemas/journal/1'
const MAJOR_GAME_VERSION = '4'
const SOFTWARE = 'E:D Market Connector'
const EVENTS = ['FSDJump', 'Location']
const IGNORE_OLDER_THAN_MS = 10 * 60 * 1000 // 10 minutes

let socket: Subscriber
let isShuttingDown = false

async function run() {
  process.on('message', (message) => {
    if (message === 'shutdown' && !isShuttingDown) {
      isShuttingDown = true
      logger.info('[EDDN Listener] Received shutdown signal')

      try {
        socket.close()
        logger.info('[EDDN Listener] ZeroMQ connection closed')
        process.send?.('shutdown_complete')
        process.exit(0)
      } catch (error) {
        logger.error(error, '[EDDN Listener] Failed to close connections')
        process.exit(1)
      }
    }
  })

  // Handle uncaught errors
  process.on('uncaughtException', (error) => {
    logger.error(error, '[EDDN Listener] Uncaught exception')
    if (!isShuttingDown) {
      process.exit(1)
    }
  })

  process.on('unhandledRejection', (error) => {
    logger.error(error, '[EDDN Listener] Unhandled promise rejection')
    if (!isShuttingDown) {
      process.exit(1)
    }
  })

  try {
    socket = new Subscriber()
    socket.connect(EDDN_URL)
    socket.subscribe('')
    logger.info(`[EDDN Listener] Connected to EDDN at ${EDDN_URL}`)

    for await (const [src] of socket) {
      if (isShuttingDown) {
        break
      }

      try {
        const message: HttpsEddnEdcdIoSchemasJournal1 = JSON.parse(zlib.inflateSync(src).toString())
        if (
          message.$schemaRef !== JOURNAL_EVENT_SCHEMA ||
          !message.header.gameversion?.startsWith(MAJOR_GAME_VERSION) ||
          !message.header.softwareName.startsWith(SOFTWARE) ||
          !EVENTS.includes(message.message.event) ||
          !message.message.StarSystem ||
          !message.message.Factions ||
          !message.message.Factions.length ||
          new Date(message.message.timestamp).getTime() < Date.now() - IGNORE_OLDER_THAN_MS
        ) {
          // eslint-disable-next-line no-continue
          continue
        }

        const eddnEventToProcess: EDDNEventToProcess = {
          StarSystem: message.message.StarSystem,
          Factions: (message.message.Factions ?? []) as unknown as EDDNFaction[],
          Conflicts: (message.message.Conflicts ?? []) as unknown as EDDNConflict[],
          timestamp: message.message.timestamp,
        }

        process.send?.(eddnEventToProcess)
      } catch (error) {
        logger.error(error, '[EDDN Listener] Message processing failed')
      }
    }
  } catch (error) {
    logger.error(error, '[EDDN Listener] Fatal error')
    if (!isShuttingDown) {
      process.exit(1)
    }
  }
}

void run()
