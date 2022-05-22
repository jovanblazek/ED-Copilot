import { Client, Intents } from 'discord.js'
import Keyv from 'keyv'
import { factionName, factionNameShort, timezone } from '../config.json'
import { Faction, Tick } from './classes'
import { CommandHandlers } from './commands'
import {
  changeLanguage,
  connectToMongo,
  errorHandler,
  initTranslations,
  onGuildJoin,
  onGuildLeave,
  refreshGuildCache,
} from './utils'
import logger from './utils/logger'
import initTickDetector from './utils/tickDetector'
import './utils/environment'

const BotClient = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
const CachedTick = new Tick(null, timezone)
const CachedFaction = new Faction(factionName, factionNameShort)
const Cache = new Keyv()

BotClient.once('ready', async () => {
  await connectToMongo()
  await initTranslations()
  await CachedTick.setup()
  await CachedFaction.setup()
  await refreshGuildCache(Cache)
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
      await changeLanguage(interaction.guildId, Cache)
      await handler({
        interaction,
        tick: CachedTick,
        faction: CachedFaction,
        cache: Cache,
      })
    }
  } catch (error) {
    await errorHandler(error, interaction)
  }
})

BotClient.on('guildCreate', async (guild) => {
  await onGuildJoin(guild)
  await refreshGuildCache(Cache)
})

BotClient.on('guildDelete', async (guild) => {
  await onGuildLeave(guild)
  await refreshGuildCache(Cache)
})

void BotClient.login(process.env.BOT_TOKEN)
