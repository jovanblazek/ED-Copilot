/* eslint-disable max-classes-per-file */
import { BaseError } from 'make-error'
import L from '../i18n/i18n-node'
import type { Locales } from '../i18n/i18n-types'

export class SystemNotFoundError extends BaseError {
  constructor({ locale, systemName }: { locale: Locales; systemName: string }) {
    super(L[locale].error.systemNotFound({ systemName }))
  }
}

export class TickFetchError extends BaseError {
  constructor({ locale }: { locale: Locales }) {
    super(L[locale].error.tickFetchError())
  }
}

export class DataParseError extends BaseError {
  constructor({ locale }: { locale: Locales }) {
    super(L[locale].error.dataParseError())
  }
}

export class InteractionError extends BaseError {
  constructor({ locale }: { locale: Locales }) {
    super(L[locale].error.unknown())
  }
}
