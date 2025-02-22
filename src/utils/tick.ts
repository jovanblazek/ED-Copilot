import * as Sentry from '@sentry/node'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import relativeTimePlugin from 'dayjs/plugin/relativeTime'
import timezonePlugin from 'dayjs/plugin/timezone'
import utcPlugin from 'dayjs/plugin/utc'
import got from 'got'
import { TickFetchError } from '../classes'
import { RedisKeys } from '../constants'
import type { Locales } from '../i18n/i18n-types'
import logger from './logger'
import { Redis } from './redis'

dayjs.extend(utcPlugin)
dayjs.extend(timezonePlugin)
dayjs.extend(relativeTimePlugin)

export const saveTickTimeToRedis = async (tickTime: Dayjs) => {
  logger.info('Caching tick time', tickTime)
  await Redis.set(RedisKeys.ticktime, tickTime.toISOString())
}

export const fetchTickTime = async (): Promise<Dayjs | null> => {
  try {
    logger.info('Fetching tick time from EDCD...')
    const url = 'https://tick.edcd.io/api/tick'
    const response = await got(url).json<string>()

    const tickTime = response ? dayjs.utc(response) : null
    if (tickTime && tickTime.isValid()) {
      await saveTickTimeToRedis(tickTime)
    }
    return tickTime
  } catch (error) {
    logger.error(error, 'Error while fetching tick time')
    Sentry.captureException(error)
    return null
  }
}

export const getCachedTickTimeUTC = async () => {
  const cachedTickTime = await Redis.get(RedisKeys.ticktime)
  if (cachedTickTime) {
    return dayjs(cachedTickTime).utc()
  }
  return null
}

export const getTickTimeUTC = async () => {
  const cachedTickTime = await getCachedTickTimeUTC()
  if (cachedTickTime) {
    return cachedTickTime
  }
  return fetchTickTime()
}

export const getTickTimeInTimezone = async ({
  locale,
  timezone,
}: {
  locale: Locales
  timezone: string
}): Promise<Dayjs> => {
  const tickTime = await getTickTimeUTC()
  if (tickTime) {
    return tickTime.tz(timezone)
  }

  throw new TickFetchError({ locale })
}

export const wasTickToday = ({ tickTime, timezone }: { tickTime: Dayjs; timezone: string }) => {
  const localTime = dayjs().tz(timezone)
  const localTickTime = tickTime.tz(timezone)
  return localTickTime.isSame(localTime, 'day')
}
