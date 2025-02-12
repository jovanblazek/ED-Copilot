import { EDDNState } from '../../../types/eddn'

export const CONFLICT_STATES = [EDDNState.Election, EDDNState.CivilWar, EDDNState.War]
export const EXPANSION_REDIS_EXPIRATION = 60 * 60 * 24 * 11 // 11 days
