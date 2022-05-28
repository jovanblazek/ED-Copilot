import i18next from 'i18next'
import Keyv from 'keyv'
import enLocale from '../../locales/en.json'
import skLocale from '../../locales/sk.json'
import { CacheNames, Languages } from '../constants'
import Preferences, { PreferencesType } from '../schemas/Preferences'
import logger from './logger'

export const initTranslations = async () => {
  await i18next.init({
    supportedLngs: [Languages.english, Languages.slovak],
    fallbackLng: Languages.english,
    // debug: true,
    resources: {
      ...enLocale,
      ...skLocale,
    },
  })
}

export const changeLanguage = async (guildId: string | null, cache: Keyv) => {
  let botLanguage = Languages.english
  if (guildId) {
    const preferences = (await cache.get(CacheNames.guildPreferences)) as {
      [guildId: string]: PreferencesType
    }
    if (preferences[guildId] === undefined) {
      logger.info(`No cached preferences found for guild ${guildId}`)
      const guildPreferences = await Preferences.findOne({ guildId })
      botLanguage = guildPreferences?.language || Languages.english
    } else {
      botLanguage = preferences[guildId].language
    }
  }

  if (botLanguage !== i18next.language) {
    await i18next.changeLanguage(botLanguage)
  }
}
