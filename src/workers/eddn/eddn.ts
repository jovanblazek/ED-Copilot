import { Subscriber } from 'zeromq'
import zlib from 'zlib'
import logger from '../../utils/logger'
import { HttpsEddnEdcdIoSchemasJournal1 } from './types'

const EDDN_URL = 'tcp://eddn.edcd.io:9500'
const JOURNAL_EVENT_SCHEMA = 'https://eddn.edcd.io/schemas/journal/1'
const MAJOR_GAME_VERSION = '4'
const SOFTWARE = 'E:D Market Connector'
const EVENTS = ['FSDJump', 'Location']

async function run() {
  const socket = new Subscriber()

  socket.connect(EDDN_URL)
  socket.subscribe('')
  logger.info(`EDDN listener connected to: ${EDDN_URL}`)

  for await (const [src] of socket) {
    const message: HttpsEddnEdcdIoSchemasJournal1 = JSON.parse(zlib.inflateSync(src).toString())
    if (
      message.$schemaRef !== JOURNAL_EVENT_SCHEMA ||
      !message.header.gameversion?.startsWith(MAJOR_GAME_VERSION) ||
      !message.header.softwareName.startsWith(SOFTWARE) ||
      !EVENTS.includes(message.message.event) ||
      !message.message.StarSystem ||
      !message.message.Factions ||
      !message.message.Factions.length
    ) {
      // eslint-disable-next-line no-continue
      continue
    }
    logger.info(message)
  }
}

void run()
