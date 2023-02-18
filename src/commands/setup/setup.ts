import { SlashCommandBuilder } from 'discord.js'
import { CommandNames, Languages, SetupSubcommands } from '../../constants'
import { Command } from '../types'
import { setupFactionHandler } from './faction'
import { setupLanguagenHandler } from './language'
import { setupProfileHandler } from './profile'
import { setupTimezoneHandler } from './timezone'

const SubcommandHandlers = {
  [SetupSubcommands.faction]: setupFactionHandler,
  [SetupSubcommands.language]: setupLanguagenHandler,
  [SetupSubcommands.profile]: setupProfileHandler,
  [SetupSubcommands.timezone]: setupTimezoneHandler,
}

const Setup: Command = {
  builder: new SlashCommandBuilder()
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
            .addChoices(...Object.entries(Languages).map(([key, value]) => ({ name: key, value })))
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(SetupSubcommands.timezone)
        .setDescription('Set bot timezone')
        .addStringOption((option) =>
          option.setName('timezone').setDescription('Timezone name').setRequired(true)
        )
    )
    // TODO move to /profile setup command and limit this command to admins only with setDefaultMemberPermissions
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

    // if (!interaction.memberPermissions?.has('Administrator')) {
    //   await interaction.reply({
    //     content: L[locale].error.adminOnly(),
    //     ephemeral: true,
    //   })
    //   return
    // }
  },
}

export default Setup
