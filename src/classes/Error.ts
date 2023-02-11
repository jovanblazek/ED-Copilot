/* eslint-disable max-classes-per-file */
import i18next from 'i18next'

export enum ErrorNames {
  SystemNotFoundError = 'SYSTEM_NOT_FOUND_ERROR',
  TickFetchError = 'TICK_FETCH_ERROR',
  DataParseError = 'DATA_PARSE_ERROR',
}

export class SystemNotFoundError extends Error {
  constructor(systemName: string) {
    // FIXME: update internationalization framework
    // @ts-ignore
    super(i18next.t('error.systemNotFound', { systemName }))
    this.name = ErrorNames.SystemNotFoundError
    Error.captureStackTrace(this, SystemNotFoundError)
  }
}

export class TickFetchError extends Error {
  constructor(message?: string) {
    // @ts-ignore
    super(message || i18next.t('error.tickFetchError'))
    this.name = ErrorNames.TickFetchError
    Error.captureStackTrace(this, TickFetchError)
  }
}

export class DataParseError extends Error {
  constructor(message?: string) {
    // @ts-ignore
    super(message || i18next.t('error.dataParseError'))
    this.name = ErrorNames.DataParseError
    Error.captureStackTrace(this, DataParseError)
  }
}
