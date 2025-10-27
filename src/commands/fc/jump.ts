import { InteractionError } from '../../classes'
import L from '../../i18n/i18n-node'
import { Prisma } from '../../utils'
import logger from '../../utils/logger'
import type { CommandHandler } from '../types'

export const fcJumpHandler: CommandHandler = async ({ interaction, context }) => {
  const sourceSystem = interaction.options.getString('source', true)
  const destinationSystem = interaction.options.getString('destination', true)
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
  })

  if (!fleetCarrier) {
    await interaction.editReply({
      content: L[context.locale].fc.jump.noFleetCarrier(),
    })
    return
  }

  // Calculate scheduled time
  const scheduledAt = new Date(Date.now() + minutesUntilJump * 60 * 1000)

  // Create the jump record and send a message
  const reply = await interaction.editReply({
    content: L[context.locale].fc.jump.scheduled({
      fleetCarrierName: fleetCarrier.name,
      sourceSystem,
      destinationSystem,
      time: Math.floor(scheduledAt.getTime() / 1000).toString(),
    }),
  })

  // Save the jump to the database
  await Prisma.fleetCarrierJump.create({
    data: {
      fleetCarrierId: fleetCarrier.id,
      scheduledAt,
      guildId: interaction.guildId,
      channelId: interaction.channelId,
      messageId: reply.id,
    },
  })

  logger.info(
    `Fleet carrier jump scheduled: ${fleetCarrier.name} from ${sourceSystem} to ${destinationSystem} at ${scheduledAt.toISOString()}`
  )
}
