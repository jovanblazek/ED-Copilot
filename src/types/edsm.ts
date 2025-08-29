export type Ranks = {
  Combat: string
  Trade: string
  Explore: string
  Soldier: string
  Exobiologist: string
  CQC: string
  Federation: string
  Empire: string
}

export type Progress = {
  Combat: number
  Trade: number
  Explore: number
  Soldier: number
  Exobiologist: number
  CQC: number
  Federation: number
  Empire: number
}

export type GetRanksResponse = {
  ranksVerbose: Ranks
  progress: Progress
}

export type GetCreditsResponse = {
  credits: {
    balance: number
  }[]
}

export type GetPositionResponse = {
  system: string
}

export type GetStationsResponse = {
  id: number
  id64: number
  name: string
  url: string
  stations: Station[]
}

export type Station = {
  id: number
  marketId: number
  type: string
  name: string
  distanceToArrival: number
  allegiance: 'Independent' | 'Federation' | 'Empire' | 'Alliance'
  government: string
  economy: string
  secondEconomy: null
  haveMarket: boolean
  haveShipyard: boolean
  haveOutfitting: boolean
  otherServices: string[]
  updateTime: {
    information: Date
    market: Date | null
    shipyard: Date | null
    outfitting: Date | null
  }
  controllingFaction?: {
    id: number
    name: string
  }
  body?: {
    id: number
    name: string
    latitude?: number
    longitude?: number
  }
}
