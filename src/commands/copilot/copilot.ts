import { ChannelType, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { InteractionError } from '../../classes'
import { CommandNames, CopilotSubcommands, Languages } from '../../constants'
import logger from '../../utils/logger'
import { Command } from '../types'
import { setupFactionHandler } from './faction'
import { setupLanguagenHandler } from './language'
import { setupTickReportChannelHandler } from './tickReportChannel'
import { setupTimezoneHandler } from './timezone'

const SubcommandHandlers = {
  [CopilotSubcommands.faction]: setupFactionHandler,
  [CopilotSubcommands.language]: setupLanguagenHandler,
  [CopilotSubcommands.timezone]: setupTimezoneHandler,
  [CopilotSubcommands.tick]: setupTickReportChannelHandler,
}

const Copilot: Command = {
  builder: new SlashCommandBuilder()
    .setName(CommandNames.copilot)
    .setDescription('Tweak the bot to your liking')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName(CopilotSubcommands.faction)
        .setDescription('Setup your faction')
        .addStringOption((option) =>
          option.setName('name').setDescription('Faction name').setRequired(true)
        )
        .addStringOption((option) =>
          option.setName('shorthand').setDescription('Faction name shorthand').setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(CopilotSubcommands.tick)
        .setDescription('Set tick report channel')
        .addChannelOption((option) =>
          option
            .setName('channel')
            .setDescription('Channel')
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(CopilotSubcommands.language)
        .setDescription('Set bot language')
        .addStringOption((option) =>
          option
            .setName('language')
            .setDescription('Language')
            .setRequired(true)
            .addChoices(...Object.entries(Languages).map(([key, value]) => ({ name: key, value })))
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(CopilotSubcommands.timezone)
        .setDescription('Set bot timezone')
        .addStringOption((option) =>
          option.setName('timezone').setDescription('Timezone name').setRequired(true)
        )
    ),
  handler: async ({ interaction, context }) => {
    await interaction.deferReply()
    if (!interaction.guildId) {
      logger.error('Discord guild id not found while calling copilot command.')
      throw new InteractionError({ locale: context.locale })
    }
    const subcommand = interaction.options.getSubcommand() as keyof typeof SubcommandHandlers
    if (SubcommandHandlers[subcommand]) {
      await SubcommandHandlers[subcommand]({ interaction, context })
    }
  },
}

export default Copilot
