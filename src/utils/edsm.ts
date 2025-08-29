import got from 'got'
import { RedisKeys, StationType } from '../constants'
import type {
  GetCreditsResponse,
  GetPositionResponse,
  GetRanksResponse,
  GetStationsResponse,
} from '../types/edsm'
import { decrypt } from './encryption'
import logger from './logger'
import { Redis } from './redis'

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
const STATION_TYPE_REDIS_EXPIRATION = 60 * 60 * 24 * 7 // 14 days

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

const EDSMStationTypesMap: Record<string, StationType> = {
  'Coriolis Starport': StationType.Coriolis,
  'Orbis Starport': StationType.Orbis,
  'Ocellus Starport': StationType.Ocellus,
  Outpost: StationType.Outpost,
  'Planetary Port': StationType.SurfacePort,
  'Planetary Outpost': StationType.PlanetarySettlement,
  'Odyssey Settlement': StationType.PlanetarySettlement,
  'Mega Ship': StationType.Megaship,
  'Asteroid base': StationType.AsteroidStation,
}

export const getStationType = async ({
  systemName,
  stationName,
}: {
  systemName: string
  stationName: string
}): Promise<StationType | null> => {
  try {
    const cachedStationType = await Redis.get(RedisKeys.stationType({ systemName, stationName }))
    if (cachedStationType) {
      return cachedStationType as StationType
    }
    const systemStations = await fetchSystemStations(systemName)
    if (!systemStations) {
      return null
    }

    const stationsToCache = systemStations.stations.filter(
      ({ type }) => type in EDSMStationTypesMap
    )

    await Promise.all(
      stationsToCache.map((station) =>
        Redis.set(
          RedisKeys.stationType({ systemName, stationName: station.name }),
          EDSMStationTypesMap[station.type],
          'EX',
          STATION_TYPE_REDIS_EXPIRATION
        )
      )
    )

    const station = stationsToCache.find(({ name }) => name === stationName)
    if (!station) {
      return null
    }
    return EDSMStationTypesMap[station.type]
  } catch (error) {
    logger.warn(`Error determining station type for ${systemName} ${stationName}`, error)
    return null
  }
}
