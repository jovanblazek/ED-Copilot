import { Queue, Worker } from 'bullmq'
import logger from '../../../utils/logger'
import { Redis } from '../../../utils/redis'
import { QueueNames } from '../../constants'
import {
  EDDNEventToProcess,
} from '../../../types/eddn'
import {
  getConflictByFactionName,
  getTrackedFactionsInSystem,
  isSystemAlreadyProcessed,
  handleStateChanges,
  addConflictNotificationsToQueue,
} from './utils'
import { getTickTime, Prisma } from '../../../utils'
import { FactionState, StateType } from '@prisma/client'
import { RedisKeys } from '../../../constants'

export const SystemProcessingQueue = new Queue(QueueNames.systemProcessing, {
  connection: Redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: true,
  },
})

export const SystemProcessingWorker = new Worker<EDDNEventToProcess>(
  QueueNames.systemProcessing,
  async (job) => {
    const { StarSystem: systemName, Factions: factions, Conflicts: conflicts, timestamp } = job.data

    const tickTime = await getTickTime()
    if (!tickTime) {
      logger.warn(`systemProcessingWorker: ${systemName} - No tick time found`)
      return
    }

    const tickTimeISO = tickTime.toISOString()
    const wasProcessed = await isSystemAlreadyProcessed({
      systemName,
      tickTimeISO,
    })
    if (wasProcessed) {
      logger.debug(`systemProcessingWorker: ${systemName} - SKIPPED`)
      return
    }

    const trackedFactions = await getTrackedFactionsInSystem(factions)

    for (const trackedFaction of trackedFactions) {
      logger.info(`systemProcessingWorker: ${systemName} - ${trackedFaction.name} - START`)

      const factionFromEvent = factions.find(({ Name }) => Name === trackedFaction.name)
      if (!factionFromEvent) {
        throw new Error(`Faction ${trackedFaction.name} not found in event`)
      }

      await Prisma.$transaction(async (trx) => {
        const currentDbStates = await trx.factionState.findMany({
          where: {
            factionId: trackedFaction.id,
            systemName,
            endedAt: null,
          },
        })

        const currentDbStatesByType = currentDbStates.reduce(
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

        const stateChanges = await handleStateChanges(trx, {
          trackedFaction,
          factionFromEvent,
          systemName,
          timestamp,
          currentDbStatesByType,
        })

        await Redis.set(
          RedisKeys.processedSystem({ tickTimestamp: tickTimeISO, systemName }),
          1
        )

        const conflict = getConflictByFactionName(conflicts, trackedFaction.name)
        if (conflict) {
          await addConflictNotificationsToQueue({
            conflict,
            ...stateChanges,
            systemName,
            trackedFaction,
            factionFromEvent,
            timestamp,
          })
        }

        logger.info(`systemProcessingWorker: ${systemName} - ${trackedFaction.name} - END`)
      })
    }
  },
  { connection: Redis }
)
