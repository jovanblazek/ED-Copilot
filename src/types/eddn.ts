export type EDDNEventToProcess = {
  StarSystem: string
  Factions: EDDNFaction[]
  Conflicts: EDDNConflict[]
  timestamp: string
}

export type EDDNFaction = {
  Name: string
  Influence: number
  ActiveStates?: EDDNFactionState[]
  RecoveringStates?: EDDNFactionState[]
  PendingStates?: EDDNFactionState[]
}

export type EDDNFactionState = {
  State: string
  Trend: number
}

export type EDDNConflict = {
  Faction1: EDDNConflictFaction
  Faction2: EDDNConflictFaction
  Status: string
  WarType: string
}

export type EDDNConflictFaction = {
  Name: string
  Stake: string
  WonDays: number
}
