import * as Sentry from '@sentry/node'
import dayjs from 'dayjs'
import type { Interaction } from 'discord.js'
import { CommandHandlers } from '../commands'
import type { Locales } from '../i18n/i18n-types'
import { baseLocale } from '../i18n/i18n-util'
import { errorHandler, Prisma } from '../utils'
import logger from '../utils/logger'
import { onGuildJoin } from './guild'

const getGuildFromDb = ({ guildId }: { guildId: string }) =>
  Prisma.guild.findFirst({
    where: { id: guildId },
  })

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
    let guild = await getGuildFromDb({ guildId: interaction.guildId! })
    if (!guild && interaction?.guild?.id) {
      logger.warn(`Guild not found for guildId '${interaction.guildId}', joining...`)
      await onGuildJoin(interaction.guild)
      guild = await getGuildFromDb({ guildId: interaction.guild.id })
    }
    if (handler && guild) {
      dayjs.locale(guild.language)
      await handler({
        interaction,
        context: {
          locale: (guild.language as Locales) || baseLocale,
          timezone: guild.timezone || 'UTC',
        },
      })
      return
    }
    throw new Error('Command or guild not found.')
  } catch (error) {
    await errorHandler(error, interaction, commandName)
  }
}
