import { Queue, Worker } from 'bullmq'
import logger from '../../../utils/logger'
import { Redis } from '../../../utils/redis'
import { QueueNames } from '../../constants'
import { EDDNEventToProcess } from '../../../types/eddn'
import { getAllStatesToEnd, getAllStatesToStart, getTrackedFactionsInSystem } from './utils'
import { Prisma } from '../../../utils'
import { FactionState, StateType } from '@prisma/client'

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
    const {
      StarSystem: systemName,
      Factions: factions,
      // Conflicts: conflicts, // TODO: Implement
      timestamp,
    } = job.data

    // Get tracked factions in this system
    const trackedFactions = await getTrackedFactionsInSystem(factions)

    for (const trackedFaction of trackedFactions) {
      logger.info(`systemProcessingWorker: ${systemName} - ${trackedFaction.name} - START`)
      const factionFromEvent = factions.find(({ Name }) => Name === trackedFaction.name)

      // Should never happen
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

        const statesToEnd = getAllStatesToEnd({
          currentDbStatesByType,
          factionFromEvent,
        })

        logger.info(
          statesToEnd,
          `systemProcessingWorker: ${systemName} - ${trackedFaction.name} - ENDING STATES`
        )

        await trx.factionState.updateMany({
          where: {
            id: { in: statesToEnd.map((state) => state.id) },
          },
          data: { endedAt: new Date(timestamp) },
        })

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

        await trx.factionState.createMany({
          data: [
            ...activeStatesToStart.map((state) => ({
              factionId: trackedFaction.id,
              systemName,
              stateName: state.State,
              stateType: StateType.Active,
              startedAt: new Date(timestamp),
            })),
            ...pendingStatesToStart.map((state) => ({
              factionId: trackedFaction.id,
              systemName,
              stateName: state.State,
              stateType: StateType.Pending,
              startedAt: new Date(timestamp),
            })),
            ...recoveringStatesToStart.map((state) => ({
              factionId: trackedFaction.id,
              systemName,
              stateName: state.State,
              stateType: StateType.Recovering,
              startedAt: new Date(timestamp),
            })),
          ],
        })

        logger.info(`systemProcessingWorker: ${systemName} - ${trackedFaction.name} - END`)
      })
    }
  },
  { connection: Redis }
)
