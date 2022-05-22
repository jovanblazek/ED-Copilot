import { SlashCommandBuilder } from '@discordjs/builders'
import i18next from 'i18next'
import { Command } from '../../classes'
import { CommandNames, Languages, SetupSubcommands } from '../../constants'
import { setupFactionHandler } from './faction'
import { setupLanguagenHandler } from './language'
import { setupProfileHandler } from './profile'

export default new Command(
  {
    name: CommandNames.setup,
  },
  new SlashCommandBuilder()
    .setName(CommandNames.setup)
    .setDescription('Tweak the bot to your liking')
    .addSubcommand((subcommand) =>
      subcommand
        .setName(SetupSubcommands.faction)
        .setDescription('Setup your faction')
        .addStringOption((option) =>
          option.setName('name').setDescription('Faction name').setRequired(true)
        )
        .addStringOption((option) =>
          option.setName('shorthand').setDescription('Faction name shorthand').setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName(SetupSubcommands.tick).setDescription('Set tick report channel')
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(SetupSubcommands.language)
        .setDescription('Set bot language')
        .addStringOption((option) =>
          option
            .setName('language')
            .setDescription('Language')
            .setRequired(true)
            .addChoices(Object.entries(Languages))
        )
    )
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
  async ({ interaction, cache }) => {
    await interaction.deferReply()
    const subcommand = interaction.options.getSubcommand()
    if (subcommand === SetupSubcommands.profile) {
      await setupProfileHandler(interaction)
      return
    }

    if (!interaction.memberPermissions?.has('ADMINISTRATOR')) {
      await interaction.reply({
        content: i18next.t('error.adminOnly'),
        ephemeral: true,
      })
      return
    }

    if (subcommand === SetupSubcommands.faction) {
      await setupFactionHandler(interaction)
      return
    }
    if (subcommand === SetupSubcommands.language) {
      await setupLanguagenHandler(interaction, cache)
    }
  }
)
