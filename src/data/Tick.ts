import { Dayjs } from 'dayjs'

export class Tick {
  ticktime: Dayjs | null
  constructor(ticktime: Dayjs | null) {
    this.ticktime = ticktime
  }

  getTicktime(): Dayjs | null {
    return this.ticktime
  }

  setTicktime(ticktime: Dayjs) {
    this.ticktime = ticktime
  }
}
