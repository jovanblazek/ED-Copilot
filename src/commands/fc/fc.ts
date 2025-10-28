import { MessageFlags, SlashCommandBuilder } from 'discord.js'
import { InteractionError } from '../../classes'
import { CommandNames, FCSubcommands } from '../../constants'
import logger from '../../utils/logger'
import type { Command } from '../types'
import { fcCancelJumpHandler } from './cancelJump'
import { fcJumpHandler } from './jump'

const SubcommandHandlers = {
  [FCSubcommands.jump]: fcJumpHandler,
  [FCSubcommands.cancelJump]: fcCancelJumpHandler,
} as const

const FC: Command = {
  builder: new SlashCommandBuilder()
    .setName(CommandNames.fc)
    .setDescription('Fleet Carrier commands')
    .addSubcommand((subcommand) =>
      subcommand
        .setName(FCSubcommands.jump)
        .setDescription('Schedule a fleet carrier jump')
        .addStringOption((option) =>
          option.setName('source').setDescription('Source system name').setRequired(true)
        )
        .addStringOption((option) =>
          option.setName('destination').setDescription('Destination system name').setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName('time')
            .setDescription('Time in minutes until jump')
            .setRequired(true)
            .setMinValue(1)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(FCSubcommands.cancelJump as string)
        .setDescription('Cancel all fleet carrier jumps in this channel')
    ),
  handler: async ({ interaction, context }) => {
    const subcommand = interaction.options.getSubcommand() as keyof typeof SubcommandHandlers
    await interaction.deferReply(
      subcommand === FCSubcommands.cancelJump ? { flags: [MessageFlags.Ephemeral] } : undefined
    )
    if (!interaction.guildId) {
      logger.error('Discord guild id not found while calling fc command.')
      throw new InteractionError({ locale: context.locale })
    }
    if (SubcommandHandlers[subcommand]) {
      await SubcommandHandlers[subcommand]({ interaction, context })
    }
  },
}

export default FC
