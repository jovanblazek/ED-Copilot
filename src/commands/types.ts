import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js'
import { Locales } from '../i18n/i18n-types'

export type CommandHandlerArgs<ContextExtension = Record<string, unknown>> = {
  interaction: ChatInputCommandInteraction<CacheType>
  context: {
    locale: Locales
    timezone: string
  } & ContextExtension
}

export type CommandHandler<ContextExtension = Record<string, unknown>> = (
  args: CommandHandlerArgs<ContextExtension>
) => Promise<void>

export type Command = {
  builder:
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | SlashCommandOptionsOnlyBuilder
  handler: CommandHandler
}
