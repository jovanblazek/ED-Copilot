import dayjs, { Dayjs } from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import got from 'got'
import i18next from 'i18next'
import { dayjsLanguage } from '../../config.json'
import logger from '../utils/logger'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.extend(localeData)

type EliteBgsTickResponse = {
  time: string
}

void import(`dayjs/locale/${dayjsLanguage}`)
  .then(() => {
    dayjs.locale(dayjsLanguage)
  })
  .catch(() => {
    logger.warn('Incorrect dayjs language specified in config.json. Falling back to default.')
  })

// TODO refactor -  move to cache and add user set timezone
export class Tick {
  ticktime: Dayjs | null
  localTimeZone: string
  isSetup: boolean

  constructor(ticktime: Dayjs | null, localTimeZone = 'Europe/Berlin') {
    this.ticktime = ticktime
    this.localTimeZone = localTimeZone
    this.isSetup = false
  }

  async setup() {
    const url = `https://elitebgs.app/api/ebgs/v5/ticks`
    const fetchedData: EliteBgsTickResponse[] = await got(url).json()

    if (fetchedData.length !== 0) {
      this.ticktime = dayjs.utc(fetchedData[0].time)
      this.isSetup = true
    } else {
      logger.error('Error while fetching tick time')
    }
  }

  // returns the tick time in the UTC format
  getTicktime(): Dayjs | null {
    return this.ticktime
  }

  setTicktime(ticktime: Dayjs) {
    this.ticktime = ticktime
  }

  // returns timezone set in config.json
  getLocalTimeZone(): string {
    return this.localTimeZone
  }

  setLocalTimeZone(localTimeZone: string) {
    this.localTimeZone = localTimeZone
  }

  getLocalTicktime(): Dayjs | null {
    const tickTime = this.getTicktime()
    if (!tickTime) {
      return null
    }
    return tickTime.tz(this.getLocalTimeZone())
  }

  wasAfterTick(date: Dayjs): boolean {
    const tickTime = this.getTicktime()
    if (!tickTime) {
      return false
    }
    const difference = date.utc().unix() - tickTime.unix()

    return difference > 0
  }

  wasTickToday(): boolean {
    const tickTime = this.getTicktime()
    if (!tickTime) {
      return false
    }
    return tickTime.date() === dayjs().utc().date()
  }

  // calculates the difference between the tick time and the current time or argument
  differenceFrom(date?: Dayjs): string {
    const tickTime = this.getTicktime()
    if (!tickTime) {
      return i18next.t('error.timeDifferenceError')
    }

    if (date) {
      return tickTime.from(date.utc())
    }
    return tickTime.from(dayjs().utc())
  }
}
