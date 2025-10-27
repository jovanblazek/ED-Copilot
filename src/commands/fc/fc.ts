import { SlashCommandBuilder } from 'discord.js'
import { InteractionError } from '../../classes'
import { CommandNames, FCSubcommands } from '../../constants'
import logger from '../../utils/logger'
import type { Command } from '../types'
import { fcJumpHandler } from './jump'

const SubcommandHandlers = {
  [FCSubcommands.jump]: fcJumpHandler,
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
    ),
  handler: async ({ interaction, context }) => {
    await interaction.deferReply()
    if (!interaction.guildId) {
      logger.error('Discord guild id not found while calling fc command.')
      throw new InteractionError({ locale: context.locale })
    }
    const subcommand = interaction.options.getSubcommand() as keyof typeof SubcommandHandlers
    if (SubcommandHandlers[subcommand]) {
      await SubcommandHandlers[subcommand]({ interaction, context })
    }
  },
}

export default FC
