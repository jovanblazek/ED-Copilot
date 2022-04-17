import dayjs, { Dayjs } from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import got from 'got'
import { Tick } from '../data/Tick'

dayjs.extend(utc)
dayjs.extend(timezone)

type EliteBgsTickResponse = {
  time: string
}

const SavedTick = new Tick(null)

// Return saved value if it's not null, otherwise, fetch it and save
export const getTickTime = async () => {
  const savedTickTime = SavedTick.getTicktime()
  if (savedTickTime) {
    return savedTickTime
  }
  try {
    const url = `https://elitebgs.app/api/ebgs/v5/ticks`
    const fetchedData: EliteBgsTickResponse[] = await got(url).json()

    if (fetchedData.length === 0) {
      return null
    }
    const tickTime = dayjs.utc(fetchedData[0].time)
    SavedTick.setTicktime(tickTime)
    return tickTime
  } catch (error) {
    console.log(error)
    return null
  }
}

export const wasAfterTick = (lastUpdate: Dayjs) => {
  const tickTime = SavedTick.getTicktime()
  if (!tickTime) {
    return false
  }
  const tickTimeLocal = tickTime.tz('Europe/Berlin')
  // const difference = (lastUpdate - tickTimeLocal) / 1000 / 60
  const difference = lastUpdate.unix() - tickTimeLocal.unix()
  console.log('Tick difference', difference)

  if (difference > 0) {
    return true
  }

  return false
}
