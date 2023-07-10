import { SlashCommandBuilder } from 'discord.js'
import { CommandNames, SetupSubcommands } from '../../constants'
import { Command } from '../types'
import { setupProfileHandler } from './profile'

const SubcommandHandlers = {
  [SetupSubcommands.profile]: setupProfileHandler,
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
    ),
  handler: async ({ interaction, context }) => {
    await interaction.deferReply()
    const subcommand = interaction.options.getSubcommand()
    if (SubcommandHandlers[subcommand]) {
      await SubcommandHandlers[subcommand]({ interaction, context })
    }
  },
}

export default Setup
