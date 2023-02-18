import { Client, GatewayIntentBits } from 'discord.js'
import { initEventHandlers } from './events'
import logger from './utils/logger'
import initTickDetector from './utils/tickDetector'
import './utils/environment'

const BotClient = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
})

BotClient.once('ready', () => {
  initEventHandlers(BotClient)
  initTickDetector(BotClient)

  logger.info('Bot is ready!')
})

void BotClient.login(process.env.BOT_TOKEN)
