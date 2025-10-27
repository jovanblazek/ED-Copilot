import * as Sentry from '@sentry/node'
import { Queue, Worker } from 'bullmq'
import type { Client } from 'discord.js'
import { Prisma } from '../../../utils'
import logger from '../../../utils/logger'
import { Redis } from '../../../utils/redis'
import { QueueNames } from '../../constants'
import type { FleetCarrierJumpCleanupJobData } from './types'

export const FleetCarrierJumpCleanupQueue = new Queue<FleetCarrierJumpCleanupJobData>(
  QueueNames.fleetCarrierJumpCleanup,
  {
    connection: Redis,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000 * 60,
      },
      removeOnComplete: 100,
      removeOnFail: 1000,
    },
  }
)

export const CreateFleetCarrierJumpCleanupWorker = ({ client }: { client: Client }) =>
  new Worker<FleetCarrierJumpCleanupJobData>(
    QueueNames.fleetCarrierJumpCleanup,
    async (job) => {
      const { fleetCarrierJumpId } = job.data

      try {
        logger.info(
          `[BullMQ] Fleet Carrier Jump Cleanup: Processing cleanup for jump ID ${fleetCarrierJumpId}`
        )

        Sentry.addBreadcrumb({
          category: QueueNames.fleetCarrierJumpCleanup,
          message: `Cleaning up fleet carrier jump ${fleetCarrierJumpId}`,
          data: {
            fleetCarrierJumpId,
          },
        })

        const jump = await Prisma.fleetCarrierJump.findUnique({
          where: {
            id: fleetCarrierJumpId,
          },
          include: {
            fleetCarrier: true,
          },
        })

        if (!jump) {
          logger.warn(
            `[BullMQ] Fleet Carrier Jump Cleanup: Jump ${fleetCarrierJumpId} not found, may have been already deleted`
          )
          return { deleted: false, reason: 'not_found' }
        }

        // Delete Discord message
        try {
          const guild = await client.guilds.fetch(jump.guildId)
          const channel = await guild.channels.fetch(jump.channelId)

          if (channel?.isTextBased()) {
            await channel.messages.delete(jump.messageId)
            logger.debug(
              `[BullMQ] Fleet Carrier Jump Cleanup: Deleted message ${jump.messageId} for fleet carrier ${jump.fleetCarrier.name}`
            )
          }
        } catch (error) {
          logger.warn(
            error,
            `[BullMQ] Fleet Carrier Jump Cleanup: Failed to delete message ${jump.messageId} - guild: ${jump.guildId}, channel: ${jump.channelId}`
          )
          // Continue with DB deletion even if message deletion fails
          Sentry.captureException(error, {
            tags: {
              queue: QueueNames.fleetCarrierJumpCleanup,
              jumpId: jump.id,
              guildId: jump.guildId,
              channelId: jump.channelId,
              messageId: jump.messageId,
            },
          })
        }

        // Delete the jump record from the database
        await Prisma.fleetCarrierJump.delete({
          where: {
            id: fleetCarrierJumpId,
          },
        })

        logger.info(
          `[BullMQ] Fleet Carrier Jump Cleanup: Successfully cleaned up jump ${fleetCarrierJumpId} for fleet carrier ${jump.fleetCarrier.name}`
        )

        return {
          deleted: true,
          fleetCarrierName: jump.fleetCarrier.name,
        }
      } catch (error) {
        logger.error(
          error,
          `[BullMQ] Fleet Carrier Jump Cleanup: Error during cleanup of jump ${fleetCarrierJumpId}`
        )

        Sentry.withScope((scope) => {
          scope.setTag('queue', QueueNames.fleetCarrierJumpCleanup)
          scope.setTag('jumpId', fleetCarrierJumpId)
          scope.setContext('JobData', {
            fleetCarrierJumpId,
            jobId: job.id,
            attemptsMade: job.attemptsMade,
          })
          Sentry.captureException(error)
        })

        throw error
      }
    },
    {
      connection: Redis,
      limiter: {
        max: 5,
        duration: 1000, // Max 5 jobs per second
      },
    }
  )
