import { CacheType, CommandInteraction } from 'discord.js'
import { DataParseError, InteractionError, SystemNotFoundError, TickFetchError } from '../classes'
import L from '../i18n/i18n-node'
import logger from './logger'

const replyToError = async (interaction: CommandInteraction<CacheType>, message: string) => {
  if (interaction.deferred) {
    await interaction.editReply({
      content: message,
    })
  } else {
    await interaction.reply({
      content: message,
      ephemeral: true,
    })
  }
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
  } else if (error instanceof InteractionError) {
    logger.info(`Interaction error`)
    await replyToError(interaction, error.message)
  } else {
    logger.error(error, `Error while handling command: ${commandName}`)
    await replyToError(interaction, L.en.error.unknown())
  }
}
