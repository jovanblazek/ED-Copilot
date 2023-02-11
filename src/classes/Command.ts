import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js'

export type CommandParameters = {
  name: string
}

export type CommandCallbackArgs = {
  interaction: ChatInputCommandInteraction<CacheType>
}

export class Command {
  params: CommandParameters
  builder:
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>

  callback: (args: CommandCallbackArgs) => Promise<void>

  constructor(
    params: CommandParameters,
    builder:
      | SlashCommandBuilder
      | SlashCommandSubcommandsOnlyBuilder
      | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>,
    callback: (args: CommandCallbackArgs) => Promise<void>
  ) {
    this.params = params
    this.builder = builder
    this.callback = callback
  }
}
