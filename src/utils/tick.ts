import * as Sentry from '@sentry/node'
import dayjs, { Dayjs } from 'dayjs'
import relativeTimePlugin from 'dayjs/plugin/relativeTime'
import timezonePlugin from 'dayjs/plugin/timezone'
import utcPlugin from 'dayjs/plugin/utc'
import got from 'got'
import { TickFetchError } from '../classes'
import { RedisExpiration, RedisKeys } from '../constants'
import { Locales } from '../i18n/i18n-types'
import logger from './logger'
import { Redis } from './redis'

dayjs.extend(utcPlugin)
dayjs.extend(timezonePlugin)
dayjs.extend(relativeTimePlugin)

type EliteBgsTickResponse = {
  time: string
}

export const fetchTickTime = async (): Promise<Dayjs | null> => {
  try {
    logger.info('Fetching tick time from EliteBGS...')
    const url = `https://elitebgs.app/api/ebgs/v5/ticks`
    const fetchedData: EliteBgsTickResponse[] = await got(url).json()

    const tickTime = fetchedData.length === 0 ? null : dayjs.utc(fetchedData[0].time)
    if (tickTime) {
      logger.info('Caching tick time')
      await Redis.set(RedisKeys.ticktime, tickTime.toISOString(), 'EX', RedisExpiration.ticktime)
    }
    return tickTime
  } catch (error) {
    logger.error(error, 'Error while fetching tick time')
    Sentry.captureException(error)
    return null
  }
}

export const getTickTime = async ({
  locale,
  timezone,
}: {
  locale: Locales
  timezone: string
}): Promise<Dayjs> => {
  const cachedTickTime = await Redis.get(RedisKeys.ticktime)
  if (cachedTickTime) {
    logger.info('Using cached tick time')
    return dayjs(cachedTickTime).tz(timezone)
  }

  const fetchedTickTime = await fetchTickTime()
  if (fetchedTickTime) {
    return fetchedTickTime.tz(timezone)
  }

  throw new TickFetchError({ locale })
}

export const wasTickToday = ({ tickTime, timezone }: { tickTime: Dayjs; timezone: string }) => {
  const localTime = dayjs().tz(timezone)
  const localTickTime = tickTime.tz(timezone)
  return localTickTime.isSame(localTime, 'day')
}
