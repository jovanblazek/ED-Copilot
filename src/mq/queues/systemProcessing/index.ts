import { Queue, Worker } from 'bullmq'
import logger from '../../../utils/logger'
import { Redis } from '../../../utils/redis'
import { QueueNames } from '../../constants'
import { EDDNEventToProcess, EDDNState } from '../../../types/eddn'
import {
  getConflictByFactionName,
  getTrackedFactionsInSystem,
  isSystemAlreadyProcessed,
  handleStateChanges,
  addConflictNotificationsToQueue,
  groupFactionStatesByType,
  addExpansionNotificationToQueue,
} from './utils'
import { getTickTime, Prisma } from '../../../utils'
import { RedisKeys } from '../../../constants'
import { EXPANSION_REDIS_EXPIRATION } from './constants'

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
        const currentDbStatesByType = groupFactionStatesByType(currentDbStates)

        const stateChanges = await handleStateChanges(trx, {
          trackedFaction,
          factionFromEvent,
          systemName,
          timestamp,
          currentDbStatesByType,
        })

        await Redis.set(RedisKeys.processedSystem({ tickTimestamp: tickTimeISO, systemName }), 1)

        // Handle conflict notifications
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

        // Handle expansion notifications
        const isExpansionPending =
          stateChanges.pendingStatesToStart.some(
            (s) => s.State === EDDNState.Expansion
          ) 
        const isExpansionActive = stateChanges.activeStatesToStart.some(
            (s) => s.State === EDDNState.Expansion
          )
        const isExpansionEnding = stateChanges.statesToEnd.some(
          (s) => s.stateName === EDDNState.Expansion
        )

        const expansionRedisKey = RedisKeys.expansion({ factionId: trackedFaction.id })

        if (isExpansionPending || isExpansionActive) {
          const isFirstOccurrence = await Redis.setnx(expansionRedisKey, 1)

          if (isFirstOccurrence) {
            await addExpansionNotificationToQueue({
              systemName,
              trackedFaction,
              factionFromEvent,
              timestamp,
              type: isExpansionPending ? 'expansionPending' : 'expansionStarted',
            })
            await Redis.expire(expansionRedisKey, EXPANSION_REDIS_EXPIRATION)
          }
        }

        if (isExpansionEnding) {
          const isDeletedFromRedis = await Redis.del(expansionRedisKey)
          if (isDeletedFromRedis) {
            await addExpansionNotificationToQueue({
              systemName,
              trackedFaction,
              factionFromEvent,
              timestamp,
              type: 'expansionEnded',
            })
          }
        }
      })
      logger.info(`systemProcessingWorker: ${systemName} - ${trackedFaction.name} - END`)
    }
  },
  { connection: Redis }
)
