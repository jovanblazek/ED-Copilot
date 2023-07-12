export interface FactionConflicsResponse extends Pagination {
  docs: FactionConflictsDoc[]
}
export interface FactionSystemsResponse extends Pagination {
  docs: FactionSystemsDoc[]
}

interface Pagination {
  total: number
  limit: number
  page: number
  pages: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: null
  nextPage: null
}

export interface FactionConflictsDoc {
  _id: string
  __v: number
  allegiance: Allegiance
  eddb_id: number
  faction_presence: FactionPresence[]
  government: string
  name: string
  name_lower: string
  updated_at: Date
}

export interface FactionSystemsDoc {
  _id: string
  __v: number
  allegiance: Allegiance
  eddb_id: number
  faction_presence: FactionPresence[]
  government: string
  name: string
  name_lower: string
  updated_at: Date
  history: History[]
}

export enum Allegiance {
  Empire = 'empire',
  Federation = 'federation',
  Independent = 'independent',
}

// TODO add generic for system details, the FactionSystemsDoc faction_presence does not have them
export interface FactionPresence {
  system_name: string
  system_name_lower: string
  system_id: string
  state: string
  influence: number
  happiness: string
  active_states: State[]
  pending_states: State[]
  recovering_states: State[]
  conflicts: FactionPresenceConflict[]
  updated_at: Date
  system_details: SystemDetails
}

export interface State {
  state: string
}

export interface FactionPresenceConflict {
  type: string
  status: string
  opponent_name: string
  opponent_name_lower: string
  opponent_faction_id: string
  station_id: null
  stake: string
  stake_lower: string
  days_won: number
}

export interface SystemDetails {
  _id: string
  __v: number
  allegiance: Allegiance
  conflicts: SystemDetailsConflict[]
  controlling_minor_faction: string
  controlling_minor_faction_cased: string
  controlling_minor_faction_id: string
  eddb_id: number
  factions: FactionElement[]
  government: string
  name: string
  name_lower: string
  population: number
  primary_economy: string
  secondary_economy: string
  security: SystemSecurity
  state: string
  system_address: string
  updated_at: Date
  x: number
  y: number
  z: number
  name_aliases: unknown[]
}

export interface SystemDetailsConflict {
  type: string
  status: string
  faction1: FactionInConflict
  faction2: FactionInConflict
}

export interface FactionInConflict {
  faction_id: string
  name: string
  name_lower: string
  station_id: null | string
  stake: string
  stake_lower: string
  days_won: number
}

export interface FactionElement {
  name: string
  name_lower: string
  faction_id: string
}

export enum SystemSecurity {
  SystemSecurityHigh = '$system_security_high;',
  SystemSecurityLow = '$system_security_low;',
  SystemSecurityMedium = '$system_security_medium;',
}

export interface History {
  _id: string
  updated_at: Date
  updated_by: string
  system: string
  system_lower: string
  system_id: string
  state: string
  influence: number
  happiness: string
  active_states: string[]
  pending_states: string[]
  recovering_states: string[]
  conflicts: FactionPresenceConflict[]
  systems: System[]
  __v: number
}

export interface System {
  system_id: string
  name: string
  name_lower: string
}
