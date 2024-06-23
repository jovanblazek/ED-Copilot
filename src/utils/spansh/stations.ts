import * as Sentry from '@sentry/node'
import {
  SpanshStationsSearchInput,
  SpanshStationsSearchResponse,
} from '../../types/spansh/stations'
import logger from '../logger'

const SPANSH_API_URL = 'https://spansh.co.uk/api/stations/search'

export const searchStations = async (input: SpanshStationsSearchInput) => {
  try {
    Sentry.addBreadcrumb({
      category: 'spansh.stations.search',
      message: 'Searching for stations',
      data: input,
    })
    const response = await fetch(SPANSH_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(input),
    })

    return (await response.json()) as SpanshStationsSearchResponse
  } catch (error) {
    logger.error(error, 'Error while fetching stations from Spansh')
    Sentry.captureException(error)
    return null
  }
}
