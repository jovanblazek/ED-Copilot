import { SlashCommandBuilder } from '@discordjs/builders'
import i18next from 'i18next'
import { Command } from '../../classes'
import { CommandNames, SetupSubcommands } from '../../constants'
import { setupFactionHandler } from './faction'

export default new Command(
  {
    // TODO maybe add admin only check as command parameter
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
    ),
  async ({ interaction }) => {
    if (!interaction.memberPermissions?.has('ADMINISTRATOR')) {
      await interaction.reply({
        content: i18next.t('error.adminOnly'),
        ephemeral: true,
      })
      return
    }
    await interaction.deferReply()
    const subcommand = interaction.options.getSubcommand()
    if (subcommand === SetupSubcommands.faction) {
      await setupFactionHandler(interaction)
    }
  }
)
