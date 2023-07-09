import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js'
import { Locales } from '../i18n/i18n-types'

export type CommandHandlerArgs = {
  interaction: ChatInputCommandInteraction<CacheType>
  context: {
    locale: Locales
    timezone: string
  }
}

export type CommandHandler = (args: CommandHandlerArgs) => Promise<void>

export type Command = {
  builder:
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
  handler: CommandHandler
}
