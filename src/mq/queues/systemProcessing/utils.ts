import { FactionState, StateType } from '@prisma/client'
import { getTrackedFactions} from '../../../utils/redis'
import { EDDNFaction, EDDNFactionState } from '../../../types/eddn'

export const getTrackedFactionsInSystem = async (eventFactions: EDDNFaction[]) => {
  const trackedFactions = await getTrackedFactions()
  return trackedFactions.filter((factionFromRedis) =>
    eventFactions.find(({ Name }) => Name === factionFromRedis.name)
  )
}

const getStatesToEnd = (currentDbStates: FactionState[], statesFromEvent: EDDNFactionState[]) => {
  return currentDbStates.filter((state) => !statesFromEvent.some((s) => s.State === state.stateName))
}

const getStatesToStart = (currentDbStates: FactionState[], statesFromEvent: EDDNFactionState[]) => {
  return statesFromEvent.filter((state) => !currentDbStates.some((s) => s.stateName === state.State))
}

export const getAllStatesToEnd = ({
  currentDbStatesByType,
  factionFromEvent,
}: {
  currentDbStatesByType: Record<StateType, FactionState[]>
  factionFromEvent: EDDNFaction
}) => {
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
