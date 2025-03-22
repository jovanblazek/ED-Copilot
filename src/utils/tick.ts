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

export const saveTickTimeToRedis = async ({
  tickTime,
  system,
}: {
  tickTime: Dayjs
  system?: string
}) => {
  if (system) {
    await Redis.set(RedisKeys.systemTickTime({ systemName: system }), tickTime.toISOString())
  } else {
    await Redis.set(RedisKeys.galaxyTickTime, tickTime.toISOString())
  }
}

export const fetchTickTime = async (): Promise<Dayjs | null> => {
  logger.info('Fetching tick time from Infomancer...')
  const url = `http://tick.infomancer.uk/galtick.json`
  const response = await got(url).json<{ lastGalaxyTick: string }>()

  return response?.lastGalaxyTick ? dayjs.utc(response.lastGalaxyTick) : null
}

export const fetchTickTimeAndCacheIt = async (): Promise<Dayjs | null> => {
  try {
    const tickTime = await fetchTickTime()
    if (tickTime && tickTime.isValid()) {
      await saveTickTimeToRedis({ tickTime })
    }
    return tickTime
  } catch (error) {
    logger.error(error, 'Error while fetching tick time')
    Sentry.captureException(error)
    return null
  }
}

export const getCachedTickTimeUTC = async ({ system }: { system?: string } = {}) => {
  const cachedTickTime = await Redis.get(
    system ? RedisKeys.systemTickTime({ systemName: system }) : RedisKeys.galaxyTickTime
  )
  if (cachedTickTime) {
    return dayjs(cachedTickTime).utc()
  }
  return null
}

export const getTickTimeUTC = async ({ system }: { system?: string } = {}) => {
  const cachedTickTime = await getCachedTickTimeUTC({ system })
  if (cachedTickTime) {
    return cachedTickTime
  }
  return fetchTickTimeAndCacheIt()
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
