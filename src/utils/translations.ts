import i18next from 'i18next'
import enLocale from '../../locales/en.json'
import skLocale from '../../locales/sk.json'
import { Languages } from '../constants'
import { Prisma } from './prismaClient'

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

export const changeLanguage = async (guildId: string | null) => {
  let botLanguage = Languages.english
  if (guildId) {
    const preferences = await Prisma.preferences.findFirst({ where: { guildId } })
    botLanguage = preferences?.language || Languages.english
  }

  if (botLanguage !== i18next.language) {
    await i18next.changeLanguage(botLanguage)
  }
}
