import { SlashCommandBuilder } from '@discordjs/builders'
import { CacheType, CommandInteraction } from 'discord.js'
import { Faction, Tick } from '../../classes'
import { CommandNames, FactionSubcommands } from '../../constants'
import { factionSystemsHandler } from './systems'

export default {
  name: CommandNames.faction,
  command: new SlashCommandBuilder()
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
  handler: async (
    interaction: CommandInteraction<CacheType>,
    CachedTick: Tick,
    CachedFaction: Faction
  ) => {
    await interaction.deferReply()
    const subcommand = interaction.options.getSubcommand()
    if (subcommand === FactionSubcommands.systems) {
      await factionSystemsHandler(interaction, CachedTick, CachedFaction)
    }
  },
}
