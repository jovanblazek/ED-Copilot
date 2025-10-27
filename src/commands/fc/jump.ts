import { bold, hyperlink } from 'discord.js'
import { InteractionError } from '../../classes'
import { InaraUrl } from '../../constants'
import { createEmbed } from '../../embeds'
import L from '../../i18n/i18n-node'
import { FleetCarrierJumpCleanupQueue } from '../../mq/queues/fleetCarrierJumpCleanup'
import { FLEET_CARRIER_JUMP_CLEANUP_JOB_NAME } from '../../mq/queues/fleetCarrierJumpCleanup/constants'
import { Prisma } from '../../utils'
import logger from '../../utils/logger'
import type { CommandHandler } from '../types'

export const fcJumpHandler: CommandHandler = async ({ interaction, context }) => {
  const sourceSystem = interaction.options.getString('source', true).trim()
  const destinationSystem = interaction.options.getString('destination', true).trim()
  const minutesUntilJump = interaction.options.getInteger('time', true)

  if (!interaction.guildId || !interaction.channelId) {
    logger.error('Discord guild id or channel id not found while calling fc jump command.')
    throw new InteractionError({ locale: context.locale })
  }

  // Get user's fleet carrier
  const fleetCarrier = await Prisma.fleetCarrier.findUnique({
    where: {
      userId: interaction.user.id,
    },
    include: {
      user: true,
    },
  })

  if (!fleetCarrier) {
    await interaction.editReply({
      content: L[context.locale].fc.jump.noFleetCarrier(),
    })
    return
  }

  // Calculate scheduled time
  const scheduledAt = new Date(Date.now() + minutesUntilJump * 60 * 1000)
  const timestamp = Math.floor(scheduledAt.getTime() / 1000)

  const sourceSystemUrl = InaraUrl.system(sourceSystem)
  const destinationSystemUrl = InaraUrl.system(destinationSystem)

  const embed = createEmbed({
    title: fleetCarrier.name,
    description: `${hyperlink(bold(sourceSystem), sourceSystemUrl)} ➡️ ${hyperlink(bold(destinationSystem), destinationSystemUrl)}\n\n<t:${timestamp}:F>\n(<t:${timestamp}:R>)`,
  }).setAuthor({
    name: fleetCarrier.user.cmdrName,
  })

  const reply = await interaction.editReply({
    embeds: [embed],
  })

  // Save the jump to the database
  const jump = await Prisma.fleetCarrierJump.create({
    data: {
      fleetCarrierId: fleetCarrier.id,
      scheduledAt,
      guildId: interaction.guildId,
      channelId: interaction.channelId,
      messageId: reply.id,
    },
  })

  // Schedule a delayed job to clean up the jump after it has occurred
  await FleetCarrierJumpCleanupQueue.add(
    `${FLEET_CARRIER_JUMP_CLEANUP_JOB_NAME}:${jump.id}`,
    {
      fleetCarrierJumpId: jump.id,
    },
    {
      delay: minutesUntilJump * 60 * 1000, // Delay in milliseconds
    }
  )
}
