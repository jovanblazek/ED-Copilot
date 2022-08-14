import { CacheType, CommandInteraction } from 'discord.js'
import i18next from 'i18next'
import { Prisma } from '../../utils'

export const setupLanguagenHandler = async (interaction: CommandInteraction<CacheType>) => {
  const { guildId } = interaction
  if (!guildId) {
    throw new Error('Guild ID not found in interaction')
  }

  const language = interaction.options.getString('language')!
  await Prisma.preferences.update({ where: { guildId }, data: { language } })
  await i18next.changeLanguage(language)
  await interaction.editReply(i18next.t('setup.language.saved'))
}
