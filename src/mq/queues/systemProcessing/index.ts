import * as Sentry from '@sentry/node'
import { Queue, Worker } from 'bullmq'
import { RedisKeys } from '../../../constants'
import type { EDDNEventToProcess } from '../../../types/eddn'
import { getCachedTickTimeUTC, Prisma } from '../../../utils'
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

    try {
      const trackedFactions = await getTrackedFactionsInSystem(factions)
      if (!trackedFactions.length) {
        return
      }

      const tickTime = await getCachedTickTimeUTC({ system: systemName })
      if (!tickTime) {
        // It is normal for systems to not have a tick time yet, e.g. newly colonized systems
        // TODO: Perhaps we should fallback to using the galaxy tick time for these systems?
        logger.info(`[BullMQ] systemProcessingWorker: ${systemName} - No tick time found`)
        return
      }

      const tickTimeISO = tickTime.toISOString()
      const wasProcessed = await isSystemAlreadyProcessed({
        systemName,
        tickTimeISO,
      })
      if (wasProcessed) {
        logger.debug(`[BullMQ] systemProcessingWorker: ${systemName} - SKIPPED`)
        return
      }

      for (const trackedFaction of trackedFactions) {
        logger.debug(
          `[BullMQ] systemProcessingWorker: ${systemName} - ${trackedFaction.name} - START`
        )

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
              factions,
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

            Sentry.withScope((scope) => {
              scope.setTag('system', systemName)
              scope.setTag('faction', trackedFaction.name)
              scope.setContext('DetectorError', {
                systemName,
                factionName: trackedFaction.name,
                stateChanges,
                conflicts,
              })
              Sentry.captureException(result.reason)
            })
          }
        })

        logger.debug(
          `[BullMQ] systemProcessingWorker: ${systemName} - ${trackedFaction.name} - END`
        )
      }
    } catch (error) {
      Sentry.withScope((scope) => {
        scope.setTag('queue', QueueNames.systemProcessing)
        scope.setTag('system', systemName)
        scope.setContext('JobData', {
          systemName,
          timestamp,
          factions: factions.map(({ Name }) => Name),
          conflicts,
          jobId: job.id,
          attemptsMade: job.attemptsMade,
        })
        Sentry.captureException(error)
      })

      throw error
    }
  },
  { connection: Redis }
)
