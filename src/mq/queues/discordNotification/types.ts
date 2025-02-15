import type { EDDNConflictStatus, EDDNWarType } from '../../../types/eddn'

type ConflictFaction = {
  name: string
  stake: string
  wonDays: number
}

export type Conflict = {
  faction1: ConflictFaction
  faction2: ConflictFaction
  status: EDDNConflictStatus
  conflictType: EDDNWarType
}

type ConflictEventData = {
  conflict: Conflict
}

type ExpansionEventData = Record<string, never>

type RetreatEventData = Record<string, never>

type InfluenceThreatEventData = {
  threateningFaction: {
    name: string
    influence: number
  }
  influenceDiff: number
}

export type EventTypeMap = {
  conflictPending: ConflictEventData
  conflictStarted: ConflictEventData
  conflictEnded: ConflictEventData
  expansionPending: ExpansionEventData
  expansionStarted: ExpansionEventData
  expansionEnded: ExpansionEventData
  retreatPending: RetreatEventData
  retreatStarted: RetreatEventData
  retreatEnded: RetreatEventData
  influenceThreat: InfluenceThreatEventData
}

export type DiscordNotificationJobData<T extends keyof EventTypeMap> = {
  systemName: string
  factionName: string
  factionInfluence: number
  event: {
    type: T
    data: EventTypeMap[T]
  }
  timestamp: string
}
