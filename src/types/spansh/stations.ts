export type SpanshStationsSearchInput = {
  filters?: Filters
  sort?: Sort[]
  reference_system: string
  page: number
  size: number
  from?: number
}

type Filters = {
  has_large_pad?: {
    value: boolean
  }
  material_trader?: {
    value: MaterialTraderType[]
  }
}

type Sort = {
  distance: {
    direction: string
  }
}

export enum MaterialTraderType {
  Encoded = 'Encoded',
  Manufatured = 'Manufatured',
  Raw = 'Raw',
}

export type SpanshStationsSearchResponse = {
  count: number
  from: number
  reference: Reference
  results: Result[]
  search: SpanshStationsSearchInput
  search_reference: string
  size: number
}

type Reference = {
  id64: number
  name: string
  x: number
  y: number
  z: number
}

type Result = {
  controlling_minor_faction: string
  distance: number
  distance_to_arrival: number
  economies: Economy[]
  government: string
  has_large_pad: boolean
  has_market: boolean
  has_outfitting: boolean
  has_shipyard: boolean
  id: string
  is_planetary: boolean
  large_pads: number
  market: unknown[]
  market_id: number
  market_updated_at: string
  material_trader: MaterialTraderType
  medium_pads: number
  modules: unknown[]
  name: string
  outfitting_updated_at: string
  power_state?: string
  primary_economy: Economy
  secondary_economy?: Economy
  services: {
    name: string
  }[]
  ships: unknown[]
  shipyard_updated_at: string
  small_pads: number
  system_id64: number
  system_name: string
  system_power: string[]
  system_x: number
  system_y: number
  system_z: number
  type: StationType
  updated_at: string
  prohibited_commodities?: {
    name: string
  }[]
  technology_broker?: string
  allegiance?: string
}

export type Economy = {
  name: string
  share: number
}

export enum StationType {
  CoriolisStarport = 'Coriolis Starport',
  OcellusStarport = 'Ocellus Starport',
}
