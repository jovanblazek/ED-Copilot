import { Client, GatewayIntentBits } from 'discord.js'
import { initEventHandlers } from './events'
import { initActivityHandler } from './utils/botActivity'
import logger from './utils/logger'
import initTickDetector from './utils/tickDetector'
import './i18n/dayjsLocales'
import './utils/environment'

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
