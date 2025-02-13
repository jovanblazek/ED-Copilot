import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

export const getPastTimeDifferenceFromNow = ({ pastTime }: { pastTime: Dayjs }) => {
  const utcTimeNow = dayjs.utc()
  return pastTime.utc().from(utcTimeNow)
}

export const isAfterTime = ({ target, isAfter }: { target: Dayjs; isAfter: Dayjs }) =>
  target.utc().isAfter(isAfter.utc())
