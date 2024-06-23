import * as Sentry from '@sentry/node'
import dayjs from 'dayjs'
import { Interaction } from 'discord.js'
import { CommandHandlers } from '../commands'
import { Locales } from '../i18n/i18n-types'
import { baseLocale } from '../i18n/i18n-util'
import { errorHandler, Prisma } from '../utils'

export const onInteractionCreate = async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) {
    return
  }
  Sentry.setContext('Interaction', {
    id: interaction.id,
    type: interaction.type,
    guildId: interaction.guildId,
    channelId: interaction.channelId,
    userId: interaction.user.id,
    commandName: interaction.commandName,
  })

  Sentry.addBreadcrumb({
    category: 'interaction.options.data',
    message: 'Interaction options data',
    data: {
      options: interaction.options.data,
    },
  })

  const { commandName } = interaction
  const handler = CommandHandlers[commandName]

  try {
    const guildPreferences = await Prisma.preferences.findFirst({
      where: { guildId: interaction.guildId! },
    })
    if (handler && guildPreferences) {
      dayjs.locale(guildPreferences.language)
      await handler({
        interaction,
        context: {
          locale: (guildPreferences.language as Locales) || baseLocale,
          timezone: guildPreferences.timezone || 'UTC',
        },
      })
      return
    }
    throw new Error('Command or guild not found.')
  } catch (error) {
    await errorHandler(error, interaction, commandName)
  }
}
