import { CacheType, CommandInteraction } from 'discord.js'
import i18next from 'i18next'
import User from '../../schemas/User'

export const setupProfileHandler = async (interaction: CommandInteraction<CacheType>) => {
  const cmdrName = interaction.options.getString('name')!
  const edsmApiKey = interaction.options.getString('edsm_api_key') || null

  const foundUser = await User.findOne({ userId: interaction.user.id })
  if (foundUser) {
    foundUser.cmdrName = cmdrName
    foundUser.edsmApiKey = edsmApiKey
    await foundUser.save()
  } else {
    await User.create({
      userId: interaction.user.id,
      cmdrName,
      edsmApiKey,
    })
  }
  await interaction.editReply(i18next.t('setup.profile.saved'))
}
