import * as Sentry from '@sentry/node'
import { Queue, Worker } from 'bullmq'
import { RedisKeys } from '../../../constants'
import type { EDDNEventToProcess } from '../../../types/eddn'
import { getTickTimeUTC, Prisma } from '../../../utils'
import logger from '../../../utils/logger'
import { Redis } from '../../../utils/redis'
import { QueueNames } from '../../constants'
import { StateDetectors } from './stateDetectors'
import type { StateChanges } from './types'
import {
  getTrackedFactionsInSystem,
  groupFactionStatesByType,
  handleStateChanges,
  isSystemAlreadyProcessed,
} from './utils'

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

    const tickTime = await getTickTimeUTC()
    if (!tickTime) {
      logger.warn(`[BullMQ] systemProcessingWorker: ${systemName} - No tick time found`)
      return
    }

    const tickTimeISO = tickTime.toISOString()
    const wasProcessed = await isSystemAlreadyProcessed({
      systemName,
      tickTimeISO,
    })
    if (wasProcessed) {
      logger.info(`[BullMQ] systemProcessingWorker: ${systemName} - SKIPPED`)
      return
    }

    const trackedFactions = await getTrackedFactionsInSystem(factions)

    for (const trackedFaction of trackedFactions) {
      logger.info(`[BullMQ] systemProcessingWorker: ${systemName} - ${trackedFaction.name} - START`)

      const factionFromEvent = factions.find(({ Name }) => Name === trackedFaction.name)
      if (!factionFromEvent) {
        throw new Error(`Faction ${trackedFaction.name} not found in event`)
      }

      let stateChanges: StateChanges
      // Handle database changes in transaction
      // eslint-disable-next-line no-await-in-loop
      await Prisma.$transaction(async (trx) => {
        const currentDbStates = await trx.factionState.findMany({
          where: {
            factionId: trackedFaction.id,
            systemName,
            endedAt: null,
          },
        })
        const currentDbStatesByType = groupFactionStatesByType(currentDbStates)

        stateChanges = await handleStateChanges(trx, {
          trackedFaction,
          factionFromEvent,
          systemName,
          timestamp,
          currentDbStatesByType,
        })

        await Redis.set(RedisKeys.processedSystem({ tickTimestamp: tickTimeISO, systemName }), 1)
      })

      // Process state detectors outside of transaction
      // eslint-disable-next-line no-await-in-loop
      const detectorResults = await Promise.allSettled(
        StateDetectors.map((detector) =>
          detector.detect({
            systemName,
            trackedFaction,
            factionFromEvent,
            timestamp,
            stateChanges,
            conflicts,
          })
        )
      )

      // Log any detector failures
      detectorResults.forEach((result, index) => {
        if (result.status === 'rejected') {
          logger.error(
            result.reason,
            `[BullMQ] systemProcessingWorker: ${systemName} - ${
              trackedFaction.name
            } - Detector ${index} failed`
          )
          Sentry.setContext('SystemProcessingWorker', {
            systemName,
            factionName: trackedFaction.name,
            detectorIndex: index,
          })
          Sentry.captureException(result.reason)
        }
      })

      logger.info(`[BullMQ] systemProcessingWorker: ${systemName} - ${trackedFaction.name} - END`)
    }
  },
  { connection: Redis }
)
