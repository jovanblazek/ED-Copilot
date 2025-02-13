import type { FactionState, Prisma as PrismaClientType } from '@prisma/client'
import { StateType } from '@prisma/client'
import { RedisKeys } from '../../../constants'
import type { EDDNConflict, EDDNFaction, EDDNFactionState } from '../../../types/eddn'
import type { TrackedFaction } from '../../../types/redis'
import logger from '../../../utils/logger'
import { getTrackedFactions, Redis } from '../../../utils/redis'
import type { Conflict } from '../discordNotification/types'
import { CONFLICT_STATES } from './constants'
import type { StateChanges } from './types'

export const getTrackedFactionsInSystem = async (eventFactions: EDDNFaction[]) => {
  const trackedFactions = await getTrackedFactions()
  return trackedFactions.filter((factionFromRedis) =>
    eventFactions.find(({ Name }) => Name === factionFromRedis.name)
  )
}

const getStatesToEnd = (currentDbStates: FactionState[], statesFromEvent: EDDNFactionState[]) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
  currentDbStates.filter((state) => !statesFromEvent.some((s) => s.State === state.stateName))

const getStatesToStart = (currentDbStates: FactionState[], statesFromEvent: EDDNFactionState[]) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
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

export const handleStateChanges = async (
  trx: PrismaClientType.TransactionClient,
  {
    trackedFaction,
    factionFromEvent,
    systemName,
    timestamp,
    currentDbStatesByType,
  }: {
    trackedFaction: TrackedFaction
    factionFromEvent: EDDNFaction
    systemName: string
    timestamp: string
    currentDbStatesByType: Record<StateType, FactionState[]>
  }
): Promise<StateChanges> => {
  const statesToEnd = getAllStatesToEnd({
    currentDbStatesByType,
    factionFromEvent,
  })

  if (statesToEnd.length > 0) {
    logger.info(
      statesToEnd,
      `systemProcessingWorker: ${systemName} - ${trackedFaction.name} - ENDING STATES`
    )

    await trx.factionState.updateMany({
      where: { id: { in: statesToEnd.map((state) => state.id) } },
      data: { endedAt: new Date(timestamp) },
    })
  }

  const { activeStatesToStart, pendingStatesToStart, recoveringStatesToStart } =
    getAllStatesToStart({
      factionFromEvent,
      currentDbStatesByType,
    })

  logger.info(
    {
      activeStatesToStart,
      pendingStatesToStart,
      recoveringStatesToStart,
    },
    `systemProcessingWorker: ${systemName} - ${trackedFaction.name} - STARTING STATES`
  )

  const createStateData = (
    states: EDDNFactionState[],
    stateType: StateType
  ): PrismaClientType.FactionStateCreateManyInput[] =>
    states.map((state) => ({
      factionId: trackedFaction.id,
      systemName,
      stateName: state.State,
      stateType,
      startedAt: new Date(timestamp),
    }))

  await trx.factionState.createMany({
    data: [
      ...createStateData(activeStatesToStart, StateType.Active),
      ...createStateData(pendingStatesToStart, StateType.Pending),
      ...createStateData(recoveringStatesToStart, StateType.Recovering),
    ],
  })

  return {
    statesToEnd,
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

export const isSystemAlreadyProcessed = ({
  systemName,
  tickTimeISO,
}: {
  systemName: string
  tickTimeISO: string
}) => {
  const processedSystemRedisKey = RedisKeys.processedSystem({
    tickTimestamp: tickTimeISO,
    systemName,
  })
  return Redis.exists(processedSystemRedisKey)
}

export const groupFactionStatesByType = (factionStates: FactionState[]) =>
  factionStates.reduce(
    (acc, state) => {
      acc[state.stateType] = acc[state.stateType] || []
      acc[state.stateType].push(state)
      return acc
    },
    {
      [StateType.Active]: [] as FactionState[],
      [StateType.Pending]: [] as FactionState[],
      [StateType.Recovering]: [] as FactionState[],
    }
  )
