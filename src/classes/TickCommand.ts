import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from '@discordjs/builders'
import { Client } from 'discord.js'
import { Command, CommandCallbackArgs, CommandParameters } from './Command'
import { Tick } from './Tick'

export class TickCommand extends Command {
  reportTick: (client: Client, tick: Tick) => Promise<void>

  constructor(
    params: CommandParameters,
    builder:
      | SlashCommandBuilder
      | SlashCommandSubcommandsOnlyBuilder
      | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>,
    callback: (params: CommandCallbackArgs) => Promise<void>,
    reportTick: (client: Client, tick: Tick) => Promise<void>
  ) {
    super(params, builder, callback)
    this.reportTick = reportTick
  }
}
