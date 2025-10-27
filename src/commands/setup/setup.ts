import { SlashCommandBuilder } from 'discord.js'
import { CommandNames, SetupSubcommands } from '../../constants'
import type { Command } from '../types'
import { setupProfileHandler } from './profile'
import { setupRemoveHandler } from './remove'

const SubcommandHandlers = {
  [SetupSubcommands.profile]: setupProfileHandler,
  [SetupSubcommands.remove]: setupRemoveHandler,
}

const Setup: Command = {
  builder: new SlashCommandBuilder()
    .setName(CommandNames.setup)
    .setDescription('Set up the important stuff')
    .addSubcommand((subcommand) =>
      subcommand
        .setName(SetupSubcommands.profile)
        .setDescription('Setup your commander profile')
        .addStringOption((option) =>
          option.setName('name').setDescription('CMDR name').setRequired(true)
        )
        .addStringOption((option) =>
          option.setName('edsm_api_key').setDescription('EDSM API key').setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName('fleet_carrier_name')
            .setDescription('Fleet carrier name')
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(SetupSubcommands.remove as string)
        .setDescription('Remove data from your profile')
        .addBooleanOption((option) =>
          option.setName('fleet_carrier').setDescription('Remove fleet carrier').setRequired(false)
        )
    ),
  handler: async ({ interaction, context }) => {
    await interaction.deferReply()
    const subcommand = interaction.options.getSubcommand() as keyof typeof SubcommandHandlers
    if (SubcommandHandlers[subcommand]) {
      await SubcommandHandlers[subcommand]({ interaction, context })
    }
  },
}

export default Setup
