import { CacheType, CommandInteraction } from 'discord.js'
import i18next from 'i18next'
import { DataParseError, SystemNotFoundError, TickFetchError } from '../classes'
import logger from './logger'

const replyToError = async (interaction: CommandInteraction<CacheType>, msgContent: string) => {
  await interaction.editReply({
    content: msgContent,
  })
}

export const errorHandler = async (
  error: Error | unknown,
  interaction: CommandInteraction<CacheType>,
  commandName: string
) => {
  if (error instanceof SystemNotFoundError) {
    logger.info(`System not found error`)
    await replyToError(interaction, error.message)
  } else if (error instanceof DataParseError) {
    logger.info(`Data parse error`)
    await replyToError(interaction, error.message)
  } else if (error instanceof TickFetchError) {
    logger.info(`Tick fetch error`)
    await replyToError(interaction, error.message)
  } else {
    logger.error(`Error while handling command ${commandName}`, error)
    await replyToError(interaction, i18next.t('error.unknown'))
  }
}
