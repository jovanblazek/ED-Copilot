import type { FormattersInitializer } from 'typesafe-i18n'
import type { Formatters, Locales } from './i18n-types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const initFormatters: FormattersInitializer<Locales, Formatters> = (_locale: Locales) => {
  const formatters: Formatters = {
    // add your formatter functions here
  }

  return formatters
}
