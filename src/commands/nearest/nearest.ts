import { SlashCommandBuilder } from 'discord.js'
import { CommandNames, NearestSubcommands } from '../../constants'
import { Command } from '../types'
import { nearestInterstellarFactorsHandler } from './interstellarFactors'
import { nearestMaterialTraderHandler } from './materialTrader'
import { nearestTechBrokerHandler } from './techBroker'

const SubcommandHandlers = {
  [NearestSubcommands.broker]: nearestTechBrokerHandler,
  [NearestSubcommands.trader]: nearestMaterialTraderHandler,
  [NearestSubcommands.factors]: nearestInterstellarFactorsHandler,
}

const Nearest: Command = {
  builder: new SlashCommandBuilder()
    .setName(CommandNames.nearest)
    .setDescription('Get nearest tech brokers, material traders or interstellar factors')
    .addSubcommand((subcommand) =>
      subcommand
        .setName(NearestSubcommands.broker)
        .setDescription('Get nearest tech brokers')
        .addStringOption((option) =>
          option.setName('system').setDescription('Your location').setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(NearestSubcommands.trader)
        .setDescription('Get nearest material traders')
        .addStringOption((option) =>
          option.setName('system').setDescription('Your location').setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(NearestSubcommands.factors)
        .setDescription('Get nearest interstellar factors')
        .addStringOption((option) =>
          option.setName('system').setDescription('Your location').setRequired(true)
        )
    ),
  handler: async ({ interaction, context }) => {
    const subcommand = interaction.options.getSubcommand() as keyof typeof SubcommandHandlers
    if (SubcommandHandlers[subcommand]) {
      await SubcommandHandlers[subcommand]({ interaction, context })
    }
  },
}

export default Nearest
