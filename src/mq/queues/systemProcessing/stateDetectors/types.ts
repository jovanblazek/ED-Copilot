import { type EDDNConflict, type EDDNFaction } from '../../../../types/eddn'
import { type TrackedFaction } from '../../../../types/redis'
import { type StateChanges } from '../types'

export interface StateDetectorConfig {
  systemName: string
  trackedFaction: TrackedFaction
  factionFromEvent: EDDNFaction
  timestamp: string
  stateChanges: StateChanges
  conflicts: EDDNConflict[]
  factions: EDDNFaction[]
}

export interface StateDetector {
  detect: (config: StateDetectorConfig) => Promise<void>
}
