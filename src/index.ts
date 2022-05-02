import { Client, Intents } from 'discord.js'
import { factionName, factionNameShort, timezone } from '../config.json'
import { Faction, Tick } from './classes'
import { CommandHandlers } from './commands'
import { connectToMongo, errorHandler, initTranslations } from './utils'
import logger from './utils/logger'
import initTickDetector from './utils/tickDetector'
import './utils/environment'

const { BOT_TOKEN } = process.env

const BotClient = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
const CachedTick = new Tick(null, timezone)
const CachedFaction = new Faction(factionName, factionNameShort)

BotClient.once('ready', async () => {
  await connectToMongo()
  await initTranslations()
  await CachedTick.setup()
  await CachedFaction.setup()
  initTickDetector(BotClient, CachedTick)

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
      await handler({
        interaction,
        tick: CachedTick,
        faction: CachedFaction,
      })
    }
  } catch (error) {
    await errorHandler(error, interaction)
  }
})

void BotClient.login(BOT_TOKEN)
