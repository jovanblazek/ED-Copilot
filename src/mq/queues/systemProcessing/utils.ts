import { FactionState, StateType } from '@prisma/client'
import { getTrackedFactions } from '../../../utils/redis'
import { EDDNConflict, EDDNFaction, EDDNFactionState } from '../../../types/eddn'
import { CONFLICT_STATES } from './constants'
import { Conflict } from '../discordNotification/types'

export const getTrackedFactionsInSystem = async (eventFactions: EDDNFaction[]) => {
  const trackedFactions = await getTrackedFactions()
  return trackedFactions.filter((factionFromRedis) =>
    eventFactions.find(({ Name }) => Name === factionFromRedis.name)
  )
}

const getStatesToEnd = (currentDbStates: FactionState[], statesFromEvent: EDDNFactionState[]) =>
  currentDbStates.filter((state) => !statesFromEvent.some((s) => s.State === state.stateName))

const getStatesToStart = (currentDbStates: FactionState[], statesFromEvent: EDDNFactionState[]) =>
  statesFromEvent.filter((state) => !currentDbStates.some((s) => s.stateName === state.State))

export const getAllStatesToEnd = ({
  currentDbStatesByType,
  factionFromEvent,
}: {
  currentDbStatesByType: Record<StateType, FactionState[]>
  factionFromEvent: EDDNFaction
}): FactionState[] => {
  const activeStatesFromEvent = factionFromEvent?.ActiveStates ?? []
  const pendingStatesFromEvent = factionFromEvent?.PendingStates ?? []
  const recoveringStatesFromEvent = factionFromEvent?.RecoveringStates ?? []

  // End states that are no longer active
  const activeStatesToEnd = getStatesToEnd(
    currentDbStatesByType[StateType.Active],
    activeStatesFromEvent
  )
  const pendingStatesToEnd = getStatesToEnd(
    currentDbStatesByType[StateType.Pending],
    pendingStatesFromEvent
  )
  const recoveringStatesToEnd = getStatesToEnd(
    currentDbStatesByType[StateType.Recovering],
    recoveringStatesFromEvent
  )

  return [...activeStatesToEnd, ...pendingStatesToEnd, ...recoveringStatesToEnd]
}

export const getAllStatesToStart = ({
  currentDbStatesByType,
  factionFromEvent,
}: {
  currentDbStatesByType: Record<StateType, FactionState[]>
  factionFromEvent: EDDNFaction
}) => {
  const activeStatesFromEvent = factionFromEvent?.ActiveStates ?? []
  const pendingStatesFromEvent = factionFromEvent?.PendingStates ?? []
  const recoveringStatesFromEvent = factionFromEvent?.RecoveringStates ?? []

  const activeStatesToStart = getStatesToStart(
    currentDbStatesByType[StateType.Active],
    activeStatesFromEvent
  )
  const pendingStatesToStart = getStatesToStart(
    currentDbStatesByType[StateType.Pending],
    pendingStatesFromEvent
  )
  const recoveringStatesToStart = getStatesToStart(
    currentDbStatesByType[StateType.Recovering],
    recoveringStatesFromEvent
  )

  return {
    activeStatesToStart,
    pendingStatesToStart,
    recoveringStatesToStart,
  }
}

export const isConflictInEDDNStateArray = (stateArray: EDDNFactionState[]) =>
  stateArray.some((state) => CONFLICT_STATES.includes(state.State))

export const getConflictByFactionName = (conflicts: EDDNConflict[], factionName: string) =>
  conflicts.find(
    (conflict) => conflict.Faction1.Name === factionName || conflict.Faction2.Name === factionName
  )

export const transformConflictToDiscordNotificationData = (conflict: EDDNConflict): Conflict => ({
  faction1: {
    name: conflict.Faction1.Name,
    stake: conflict.Faction1.Stake,
    wonDays: conflict.Faction1.WonDays,
  },
  faction2: {
    name: conflict.Faction2.Name,
    stake: conflict.Faction2.Stake,
    wonDays: conflict.Faction2.WonDays,
  },
  status: conflict.Status,
  conflictType: conflict.WarType,
})
