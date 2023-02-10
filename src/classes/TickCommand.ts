import { Client, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js'
import { Command, CommandCallbackArgs, CommandParameters } from './Command'

export class TickCommand extends Command {
  reportTick: (client: Client) => Promise<void>

  constructor(
    params: CommandParameters,
    builder:
      | SlashCommandBuilder
      | SlashCommandSubcommandsOnlyBuilder
      | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>,
    callback: (params: CommandCallbackArgs) => Promise<void>,
    reportTick: (client: Client) => Promise<void>
  ) {
    super(params, builder, callback)
    this.reportTick = reportTick
  }
}
