import { Worker } from 'bullmq'
import { Client, GatewayIntentBits } from 'discord.js'
import Koa from 'koa'
import { initEventHandlers } from './events'
import { initMQ } from './mq'
import { initActivityHandler } from './utils/botActivity'
import logger from './utils/logger'
import { loadTrackedFactionsFromDBToRedis, Redis } from './utils/redis'
import initTickDetector from './utils/tickDetector'
import startEDDNListenerProcess from './workers/eddn/eddn'
import './i18n/dayjsLocales'
import './utils/environment'
import './utils/sentry'

let eddnProcess: ReturnType<typeof startEDDNListenerProcess> | null = null
let BullMQWorkers: Worker[] = []
const BotClient = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
})

BotClient.once('ready', () => {
  initEventHandlers(BotClient)
  initActivityHandler(BotClient)
  if (process.env.NODE_ENV === 'production') {
    initTickDetector(BotClient)
  }

  logger.info('Bot is ready!')
})

void BotClient.login(process.env.BOT_TOKEN)

// Server used as a health check for the bot
const KoaApp = new Koa()
KoaApp.use((ctx) => {
  ctx.body = {
    status: 'ok',
    timestamp: new Date().toISOString(),
  }
})
KoaApp.listen(process.env.PORT, () => {
  logger.info(`Koa server is running on port ${process.env.PORT!}`)
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
Redis.on('ready', async () => {
  logger.info('Redis is ready!')
  await loadTrackedFactionsFromDBToRedis()
  BullMQWorkers = initMQ({ client: BotClient })
  if (process.env.NODE_ENV === 'production' || process.env.DEBUG_EDDN_WORKER === 'true') {
    eddnProcess = startEDDNListenerProcess()
  }
})

// Graceful shutdown
let isShuttingDown = false

const shutdown = async () => {
  if (isShuttingDown) {
    return
  }
  isShuttingDown = true

  logger.info('Shutting down...')

  // Close Discord client
  logger.info('Closing Discord client...')
  await BotClient.destroy()
  logger.info('Discord client closed')

  // Close EDDN worker
  if (eddnProcess) {
    await eddnProcess.shutdown()
    logger.info('EDDN worker terminated')
  }

  // Close BullMQ workers
  logger.info('Closing BullMQ workers...')
  await Promise.all(BullMQWorkers.map((worker) => worker.close()))
  logger.info('BullMQ workers closed')

  // Close Redis connection
  logger.info('Closing Redis connection...')
  await Redis.quit()
  logger.info('Redis connection closed')

  // Close Koa server
  logger.info('Closing Koa server...')
  await new Promise<void>((resolve) => {
    KoaApp.listen().close(() => resolve())
  })
  logger.info('Koa server closed')

  // Give time for connections to close
  await new Promise((resolve) => {
    setTimeout(resolve, 500)
  })

  process.exit(0)
}

process.on('SIGTERM', () => {
  void shutdown()
})
process.on('SIGINT', () => {
  void shutdown()
})
