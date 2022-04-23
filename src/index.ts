import { Client, Intents } from 'discord.js'
import { timezone } from '../config.json'
import { Tick } from './classes'
import { CommandHandlers } from './commands'
import { errorHandler, fetchTickTime, initTranslations } from './utils'
import logger from './utils/logger'
import initTickDetector from './utils/tickDetector'
import './utils/environment'

const { BOT_TOKEN } = process.env

const BotClient = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
const SavedTick = new Tick(null, timezone)

BotClient.once('ready', async () => {
  await fetchTickTime().then((tickTime) => {
    if (tickTime) {
      SavedTick.setTicktime(tickTime)
    }
  })
  await initTranslations()
  initTickDetector(BotClient, SavedTick)

  logger.info('Bot is ready!')
})

BotClient.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    return
  }

  const { commandName } = interaction
  const handler = CommandHandlers[commandName]

  try {
    if (handler) {
      await CommandHandlers[commandName](interaction, SavedTick)
    }
  } catch (error) {
    await errorHandler(error, interaction)
  }
})

void BotClient.login(BOT_TOKEN)
