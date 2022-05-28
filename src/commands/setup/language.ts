import { CacheType, CommandInteraction } from 'discord.js'
import i18next from 'i18next'
import Keyv from 'keyv'
import Preferences from '../../schemas/Preferences'
import { refreshGuildPreferencesCache } from '../../utils'

export const setupLanguagenHandler = async (
  interaction: CommandInteraction<CacheType>,
  cache: Keyv
) => {
  const language = interaction.options.getString('language')!
  await Preferences.findOneAndUpdate({ guildId: interaction.guildId }, { language })
  await refreshGuildPreferencesCache(cache)
  await i18next.changeLanguage(language)
  await interaction.editReply(i18next.t('setup.language.saved'))
}
