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

// States might be improperly named. Just guessing based on the data I have observed.
export enum EDDNState {
  Blight = 'Blight',
  Boom = 'Boom',
  Bust = 'Bust',
  CivilLiberty = 'CivilLiberty',
  CivilUnrest = 'CivilUnrest',
  CivilWar = 'CivilWar',
  Drought = 'Drought',
  Election = 'Election',
  Expansion = 'Expansion',
  Famine = 'Famine',
  InfrastructureFailure = 'InfrastructureFailure',
  Investment = 'Investment',
  Lockdown = 'Lockdown',
  NaturalDisaster = 'NaturalDisaster',
  Outbreak = 'Outbreak',
  PirateAttack = 'PirateAttack',
  PublicHoliday = 'PublicHoliday',
  Retreat = 'Retreat',
  TerroristAttack = 'TerroristAttack',
  War = 'War',
}

export type EDDNFactionState = {
  State: EDDNState
  Trend: number
}

export enum EDDNWarType {
  Election = 'election',
  CivilWar = 'civilwar',
  War = 'war',
}

export enum EDDNConflictStatus {
  Pending = 'pending',
  Active = 'active',
  Ended = 'ended', // TODO: Confirm this
}

export type EDDNConflict = {
  Faction1: EDDNConflictFaction
  Faction2: EDDNConflictFaction
  Status: EDDNConflictStatus
  WarType: EDDNWarType
}

export type EDDNConflictFaction = {
  Name: string
  Stake: string
  WonDays: number
}
