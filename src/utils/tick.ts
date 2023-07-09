import dayjs, { Dayjs } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import got from 'got'
import { TickFetchError } from '../classes'
import { Locales } from '../i18n/i18n-types'
import logger from './logger'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)

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
  localTimezone,
}: {
  locale: Locales
  localTimezone: string
}): Promise<Dayjs> => {
  if (cachedTickTime) {
    return cachedTickTime.tz(localTimezone)
  }

  const fetchedTickTime = await fetchTickTime()

  if (fetchedTickTime) {
    cachedTickTime = fetchedTickTime
    return cachedTickTime.tz(localTimezone)
  }

  throw new TickFetchError({ locale })
}

export const setTickTime = (tickTime: Dayjs): void => {
  cachedTickTime = tickTime
}

export const wasTickToday = ({
  tickTime,
  localTimezone,
}: {
  tickTime: Dayjs
  localTimezone: string
}) => {
  const localTime = dayjs().tz(localTimezone)
  const localTickTime = tickTime.tz(localTimezone)
  return localTickTime.isSame(localTime, 'day')
}

export const getTickDifferenceFromNow = ({ tickTime }: { tickTime: Dayjs }) => {
  const utcTimeNow = dayjs.utc()
  return tickTime.from(utcTimeNow)
}
