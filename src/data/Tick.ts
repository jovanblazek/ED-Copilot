import dayjs, { Dayjs } from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import i18next from 'i18next'
import { dayjsLanguage } from '../../config.json'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.extend(localeData)

void import(`dayjs/locale/${dayjsLanguage}`)
  .then(() => {
    dayjs.locale(dayjsLanguage)
  })
  .catch(() => {
    console.log('Incorrect dayjs language specified in config.json. Falling back to default.')
  })

export class Tick {
  ticktime: Dayjs | null
  localTimeZone: string

  constructor(ticktime: Dayjs | null, localTimeZone = 'Europe/Berlin') {
    this.ticktime = ticktime
    this.localTimeZone = localTimeZone
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
