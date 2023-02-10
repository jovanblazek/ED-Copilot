// import the original type declarations
import enLocale from '../../locales/en.json'
import skLocale from '../../locales/sk.json'
import 'i18next'

declare module 'i18next' {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    defaultNS: 'en'
    resources: {
      en: (typeof enLocale)['en']['translation']
      sk: (typeof skLocale)['sk']['translation']
    }
  }
}
