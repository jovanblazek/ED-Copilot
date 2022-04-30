import { SlashCommandBuilder } from '@discordjs/builders'
import { Command } from '../../classes'
import { CommandNames, FactionSubcommands } from '../../constants'
import { factionSystemsHandler } from './systems'

export default new Command(
  {
    name: CommandNames.faction,
  },
  new SlashCommandBuilder()
    .setName(CommandNames.faction)
    .setDescription('Get information about your faction')
    .addSubcommand((subcommand) =>
      subcommand
        .setName(FactionSubcommands.systems)
        .setDescription('Get information about systems of your faction')
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(FactionSubcommands.conflicts)
        .setDescription('Get information about conflicts of your faction')
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(FactionSubcommands.stations)
        .setDescription('Get information about stations of your faction')
    ),
  async ({ interaction, tick, faction }) => {
    await interaction.deferReply()
    const subcommand = interaction.options.getSubcommand()
    if (subcommand === FactionSubcommands.systems) {
      await factionSystemsHandler(interaction, tick, faction)
    }
  }
)
