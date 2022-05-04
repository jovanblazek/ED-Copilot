import { SlashCommandBuilder } from '@discordjs/builders'
import i18next from 'i18next'
import { Command } from '../classes'
import { CommandNames, Emojis } from '../constants'
import User from '../schemas/User'
import { addCommasToNumber, createEmbed, fetchEDSMProfile } from '../utils'

export default new Command(
  {
    name: CommandNames.commanderProfile,
  },
  new SlashCommandBuilder()
    .setName(CommandNames.commanderProfile)
    .setDescription('Get your commander profile')
    .addStringOption((option) =>
      option.setName('name').setDescription('CMDR name').setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName('edsm_api_key')
        .setDescription('https://www.edsm.net/en/settings/api')
        .setRequired(false)
    ),
  async ({ interaction }) => {
    const cmdrName = interaction.options.getString('name')
    const edsmApiKey = interaction.options.getString('edsm_api_key')

    /**
     * IF User did not provide an EDSM API key
     *  - Get it from the database
     *  - If the user has an EDSM API key, use it to get the commander profile
     * ---
     * ELSE User provided an EDSM API key
     * - Update user with key if exists
     * - If not, create new user with the key
     */
    if (!edsmApiKey && !cmdrName) {
      await interaction.deferReply()
      const foundUser = await User.findOne({ userId: interaction.user.id })
      if (foundUser) {
        const profile = await fetchEDSMProfile(foundUser.cmdrName, foundUser.edsmApiKey)
        if (!profile) {
          await interaction.editReply(i18next.t('error.general'))
          return
        }

        const {
          commanderName,
          credits: { credits },
          position,
          ranks: { progress, ranksVerbose: ranks },
        } = profile

        const embed = createEmbed({
          title: `CMDR ${commanderName}`,
        })
        embed.addField('Last position', `${Emojis.system} ${position.system}`)
        embed.addField('Balance', `${addCommasToNumber(credits[0].balance)} Cr`)
        embed.addField('Combat', `${ranks.Combat} (${progress.Combat}%)`)
        embed.addField('Trade', `${ranks.Trade} (${progress.Trade}%)`)
        embed.addField('Explore', `${ranks.Explore} (${progress.Explore}%)`)
        embed.addField('Mercenary', `${ranks.Soldier} (${progress.Soldier}%)`)
        embed.addField('Exobiologist', `${ranks.Exobiologist} (${progress.Exobiologist}%)`)
        embed.addField('CQC', `${ranks.CQC} (${progress.CQC}%)`)
        embed.addField('Federation', `${ranks.Federation} (${progress.Federation}%)`)
        embed.addField('Empire', `${ranks.Empire} (${progress.Empire}%)`)
        await interaction.editReply({
          embeds: [embed],
        })
      } else {
        await interaction.editReply(i18next.t('commanderProfile.notFound'))
      }
    } else if (edsmApiKey && cmdrName) {
      await interaction.deferReply({ ephemeral: true })
      const foundUser = await User.findOneAndUpdate(
        { userId: interaction.user.id },
        { edsmApiKey, cmdrName }
      )
      if (!foundUser) {
        await User.create({ userId: interaction.user.id, edsmApiKey, cmdrName })
      }
      await interaction.editReply(i18next.t('commanderProfile.saved'))
    } else {
      await interaction.deferReply({ ephemeral: true })
      await interaction.editReply(i18next.t('commanderProfile.notFound'))
    }
  }
)
