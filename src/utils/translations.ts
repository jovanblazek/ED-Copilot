import i18next from 'i18next'
import { language } from '../../config.json'
import enLocale from '../../locales/en.json'
import skLocale from '../../locales/sk.json'

export const initTranslations = async () => {
  await i18next.init({
    lng: language,
    fallbackLng: 'en',
    // debug: true,
    resources: {
      ...enLocale,
      ...skLocale,
    },
  })
}
