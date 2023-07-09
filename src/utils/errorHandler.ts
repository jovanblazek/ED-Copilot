import { CacheType, CommandInteraction } from 'discord.js'
import { DataParseError, SystemNotFoundError, TickFetchError } from '../classes'
import L from '../i18n/i18n-node'
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
    logger.error(error, `Error while handling command ${commandName}`)
    await replyToError(interaction, L.en.error.unknown())
  }
}
