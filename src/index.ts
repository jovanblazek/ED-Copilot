import { Client, GatewayIntentBits } from 'discord.js'
import Koa from 'koa'
import { initEventHandlers } from './events'
import { initActivityHandler } from './utils/botActivity'
import logger from './utils/logger'
import { Redis } from './utils/redis'
import initTickDetector from './utils/tickDetector'
import './i18n/dayjsLocales'
import './utils/environment'
import './utils/sentry'

void Redis.connect()

Redis.on('ready', () => {
  logger.info('Redis is ready!')
})

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
