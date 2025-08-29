import got from 'got'
import type {
  GetCreditsResponse,
  GetPositionResponse,
  GetRanksResponse,
  GetStationsResponse,
} from '../types/edsm'
import { decrypt } from './encryption'
import logger from './logger'

type EdsmProfile = {
  commanderName: string
  position: GetPositionResponse
  ranks: GetRanksResponse
  credits: GetCreditsResponse
} | null

const RANKS_URL = 'https://www.edsm.net/api-commander-v1/get-ranks'
const CREDITS_URL = 'https://www.edsm.net/api-commander-v1/get-credits'
const POSITION_URL = 'https://www.edsm.net/api-logs-v1/get-position'
const STATIONS_URL = 'https://www.edsm.net/api-system-v1/stations'

export const fetchEDSMProfile = async (
  commanderName: string,
  apiKey: string
): Promise<EdsmProfile> => {
  try {
    const searchParams = {
      commanderName,
      apiKey,
    }

    const response = await Promise.all([
      got(RANKS_URL, {
        searchParams,
      }).json<GetRanksResponse>(),
      got(CREDITS_URL, {
        searchParams,
      }).json<GetCreditsResponse>(),
      got(POSITION_URL, {
        searchParams,
      }).json<GetPositionResponse>(),
    ])
    return {
      commanderName,
      ranks: response[0],
      credits: response[1],
      position: response[2],
    }
  } catch (error) {
    logger.warn(`Error fetching EDSM profile for ${commanderName}`, error)
    return null
  }
}

export const fetchCommanderCredits = (commanderName: string, apiKey: string | null) => {
  try {
    if (!apiKey) {
      return null
    }
    return got(CREDITS_URL, {
      searchParams: {
        commanderName,
        apiKey: decrypt(apiKey),
      },
    }).json<GetCreditsResponse>()
  } catch (error) {
    logger.warn(`Error fetching EDSM credits for ${commanderName}`, error)
    return null
  }
}

export const fetchSystemStations = async (systemName: string) => {
  try {
    const response = await got(STATIONS_URL, {
      searchParams: {
        systemName,
      },
    }).json<GetStationsResponse>()
    return response
  } catch (error) {
    logger.warn(`Error fetching EDSM stations for ${systemName}`, error)
    return null
  }
}
