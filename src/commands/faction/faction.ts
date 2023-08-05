import { SlashCommandBuilder } from 'discord.js'
import { InteractionError } from '../../classes'
import { CommandNames, FactionSubcommands } from '../../constants'
import L from '../../i18n/i18n-node'
import { Prisma } from '../../utils'
import logger from '../../utils/logger'
import { Command } from '../types'
import { factionConflictsHandler } from './conflicts'
import { factionStationsHandler } from './stations'
import { factionSystemsHandler } from './systems'

const SubcommandHandlers = {
  [FactionSubcommands.conflicts]: factionConflictsHandler,
  [FactionSubcommands.stations]: factionStationsHandler,
  [FactionSubcommands.systems]: factionSystemsHandler,
} as const

const Faction: Command = {
  builder: new SlashCommandBuilder()
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
    ),
  // Not fully developed, move to systemInfo command
  // .addSubcommand((subcommand) =>
  //   subcommand
  //     .setName(FactionSubcommands.stations)
  //     .setDescription('Get information about stations of your faction')
  // ),
  handler: async ({ interaction, context }) => {
    await interaction.deferReply()
    if (!interaction.guildId) {
      logger.error('Discord guild id not found while calling faction command.')
      throw new InteractionError({ locale: context.locale })
    }
    const subcommand = interaction.options.getSubcommand() as keyof typeof SubcommandHandlers
    if (SubcommandHandlers[subcommand]) {
      const faction = await Prisma.faction.findFirst({
        where: {
          guildId: interaction.guildId,
        },
      })
      if (!faction) {
        await interaction.editReply({
          content: L[context.locale].faction.notSetup(),
        })
        return
      }
      await SubcommandHandlers[subcommand]({
        interaction,
        context: {
          ...context,
          faction,
        },
      })
    }
  },
}

export default Faction
