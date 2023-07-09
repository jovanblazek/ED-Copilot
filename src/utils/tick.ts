import dayjs, { Dayjs } from 'dayjs'
import relativeTimePlugin from 'dayjs/plugin/relativeTime'
import timezonePlugin from 'dayjs/plugin/timezone'
import utcPlugin from 'dayjs/plugin/utc'
import got from 'got'
import { TickFetchError } from '../classes'
import { Locales } from '../i18n/i18n-types'
import logger from './logger'

dayjs.extend(utcPlugin)
dayjs.extend(timezonePlugin)
dayjs.extend(relativeTimePlugin)

let cachedTickTime: Dayjs | null = null

type EliteBgsTickResponse = {
  time: string
}

export const fetchTickTime = async (): Promise<Dayjs | null> => {
  try {
    logger.info('Fetching tick time from EliteBGS...')
    const url = `https://elitebgs.app/api/ebgs/v5/ticks`
    const fetchedData: EliteBgsTickResponse[] = await got(url).json()

    return fetchedData.length === 0 ? null : dayjs.utc(fetchedData[0].time)
  } catch (error) {
    logger.error(error, 'Error while fetching tick time')
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
  if (cachedTickTime) {
    return cachedTickTime.tz(timezone)
  }

  const fetchedTickTime = await fetchTickTime()

  if (fetchedTickTime) {
    cachedTickTime = fetchedTickTime
    return cachedTickTime.tz(timezone)
  }

  throw new TickFetchError({ locale })
}

export const setTickTime = (tickTime: Dayjs): void => {
  cachedTickTime = tickTime
}

export const wasTickToday = ({ tickTime, timezone }: { tickTime: Dayjs; timezone: string }) => {
  const localTime = dayjs().tz(timezone)
  const localTickTime = tickTime.tz(timezone)
  return localTickTime.isSame(localTime, 'day')
}

export const getTickDifferenceFromNow = ({ tickTime }: { tickTime: Dayjs }) => {
  const utcTimeNow = dayjs.utc()
  return tickTime.from(utcTimeNow)
}
