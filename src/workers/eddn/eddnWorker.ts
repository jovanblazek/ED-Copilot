import { parentPort } from 'worker_threads'
import { Subscriber } from 'zeromq'
import zlib from 'zlib'
import logger from '../../utils/logger'
import { HttpsEddnEdcdIoSchemasJournal1 } from './types'
import { EDDNConflict, EDDNEventToProcess, EDDNFaction } from '../../types/eddn'

const EDDN_URL = 'tcp://eddn.edcd.io:9500'
const JOURNAL_EVENT_SCHEMA = 'https://eddn.edcd.io/schemas/journal/1'
const MAJOR_GAME_VERSION = '4'
const SOFTWARE = 'E:D Market Connector'
const EVENTS = ['FSDJump', 'Location']
const IGNORE_OLDER_THAN_MS = 10 * 60 * 1000 // 10 minutes

let socket: Subscriber

async function run() {
  socket = new Subscriber()

  socket.connect(EDDN_URL)
  socket.subscribe('')
  logger.info(`EDDN listener worker connected to: ${EDDN_URL}`)

  // Handle worker termination
  parentPort?.on('message', async (message) => {
    if (message === 'shutdown') {
      logger.info('EDDN worker received shutdown signal')
      try {
        await socket.close()
        logger.info('EDDN socket closed successfully')
        parentPort?.postMessage('shutdown_complete')
        parentPort?.close()
        process.exit(0)
      } catch (error) {
        logger.error(error,'Error closing EDDN socket')
        process.exit(1)
      }
    }
  })

  for await (const [src] of socket) {
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
        continue
      }

      const eddnEventToProcess: EDDNEventToProcess = {
        StarSystem: message.message.StarSystem,
        Factions: (message.message.Factions ?? []) as unknown as EDDNFaction[],
        Conflicts: (message.message.Conflicts ?? []) as unknown as EDDNConflict[],
        timestamp: message.message.timestamp,
      }

      parentPort?.postMessage(eddnEventToProcess)
    } catch (error) {
      logger.error(error, 'Error processing EDDN message:')
    }
  }
}

void run() 