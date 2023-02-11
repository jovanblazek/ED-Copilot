import { Client, GatewayIntentBits } from 'discord.js'
import { CommandHandlers } from './commands'
import { Locales } from './i18n/i18n-types'
import { baseLocale } from './i18n/i18n-util'
import { errorHandler, initTranslations, onGuildJoin, onGuildLeave, Prisma } from './utils'
import logger from './utils/logger'
import initTickDetector from './utils/tickDetector'
import './utils/environment'

const BotClient = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
})

BotClient.once('ready', async () => {
  await initTranslations()
  initTickDetector(BotClient)

  logger.info('Bot is ready!')
})

BotClient.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return
  }

  const { commandName } = interaction
  const handler = CommandHandlers[commandName]

  try {
    const guildPreferences = await Prisma.preferences.findFirst({
      where: { guildId: interaction.guildId! },
    })
    if (handler && guildPreferences) {
      await handler({
        interaction,
        context: {
          locale: (guildPreferences?.language as Locales) || baseLocale,
        },
      })
    }
  } catch (error) {
    await errorHandler(error, interaction, commandName)
  }
})

BotClient.on('guildCreate', async (guild) => {
  await onGuildJoin(guild)
})

BotClient.on('guildDelete', async (guild) => {
  await onGuildLeave(guild)
})

void BotClient.login(process.env.BOT_TOKEN)
