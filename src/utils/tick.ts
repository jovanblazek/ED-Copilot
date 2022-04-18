import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import got from 'got'

dayjs.extend(utc)

type EliteBgsTickResponse = {
  time: string
}

export const fetchTickTime = async (): Promise<Dayjs | null> => {
  try {
    const url = `https://elitebgs.app/api/ebgs/v5/ticks`
    const fetchedData: EliteBgsTickResponse[] = await got(url).json()

    return fetchedData.length === 0 ? null : dayjs.utc(fetchedData[0].time)
  } catch (error) {
    console.log('Error while fetching tick time', error)
    return null
  }
}
