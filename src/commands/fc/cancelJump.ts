import { InteractionError } from '../../classes'
import L from '../../i18n/i18n-node'
import { FleetCarrierJumpCleanupQueue } from '../../mq/queues/fleetCarrierJumpCleanup'
import { FLEET_CARRIER_JUMP_CLEANUP_JOB_NAME } from '../../mq/queues/fleetCarrierJumpCleanup/constants'
import { Prisma } from '../../utils'
import logger from '../../utils/logger'
import type { CommandHandler } from '../types'

export const fcCancelJumpHandler: CommandHandler = async ({ interaction, context }) => {
  if (!interaction.guildId || !interaction.channelId || !interaction.channel?.isTextBased()) {
    logger.error('Discord guild id or channel id not found while calling fc cancel-jump command.')
    throw new InteractionError({ locale: context.locale })
  }

  // Get user's fleet carrier
  const fleetCarrier = await Prisma.fleetCarrier.findUnique({
    where: {
      userId: interaction.user.id,
    },
  })

  if (!fleetCarrier) {
    await interaction.editReply({
      content: L[context.locale].fc.cancelJump.noFleetCarrier(),
    })
    return
  }

  // Find all jumps for this fleet carrier in the current channel
  const jumps = await Prisma.fleetCarrierJump.findMany({
    where: {
      fleetCarrierId: fleetCarrier.id,
      channelId: interaction.channelId,
    },
  })

  if (jumps.length === 0) {
    await interaction.editReply({
      content: L[context.locale].fc.cancelJump.noJumps(),
    })
    return
  }

  // Delete all Discord messages
  await Promise.allSettled(
    jumps.map(async (jump) => {
      try {
        await interaction.channel?.messages.delete(jump.messageId)
      } catch (error) {
        logger.error(
          error,
          `[FC Cancel Jump] Failed to delete message ${jump.messageId} - guild: ${jump.guildId}, channel: ${jump.channelId}`
        )
      }
    })
  )

  // Cancel all scheduled cleanup jobs
  await Promise.allSettled(
    jumps.map(async (jump) => {
      try {
        const jobId = `${FLEET_CARRIER_JUMP_CLEANUP_JOB_NAME}:${jump.id}`
        const job = await FleetCarrierJumpCleanupQueue.getJob(jobId)
        if (job) {
          await job.remove()
        }
      } catch (error) {
        logger.error(error, `[FC Cancel Jump] Failed to remove cleanup job for jump ${jump.id}`)
      }
    })
  )

  // Delete all jump records from the database
  await Prisma.fleetCarrierJump.deleteMany({
    where: {
      id: {
        in: jumps.map((j) => j.id),
      },
    },
  })

  await interaction.editReply({
    content: L[context.locale].fc.cancelJump.success({ count: jumps.length }),
  })
}
