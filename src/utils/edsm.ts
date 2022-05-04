import got from 'got'
import logger from './logger'

type Ranks = {
  Combat: string
  Trade: string
  Explore: string
  Soldier: string
  Exobiologist: string
  CQC: string
  Federation: string
  Empire: string
}

type Progress = {
  Combat: number
  Trade: number
  Explore: number
  Soldier: number
  Exobiologist: number
  CQC: number
  Federation: number
  Empire: number
}

type RanksResponse = {
  ranksVerbose: Ranks
  progress: Progress
}

type CreditsResponse = {
  credits: {
    balance: number
  }[]
}

type PositionResponse = {
  system: string
}

type EdsmProfile = {
  commanderName: string
  position: PositionResponse
  ranks: RanksResponse
  credits: CreditsResponse
} | null

const RANKS_URL = 'https://www.edsm.net/api-commander-v1/get-ranks'
const CREDITS_URL = 'https://www.edsm.net/api-commander-v1/get-credits'
const POSITION_URL = 'https://www.edsm.net/api-logs-v1/get-position'

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
      }).json<RanksResponse>(),
      got(CREDITS_URL, {
        searchParams,
      }).json<CreditsResponse>(),
      got(POSITION_URL, {
        searchParams,
      }).json<PositionResponse>(),
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
