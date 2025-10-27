import L from '../../i18n/i18n-node'
import { Prisma } from '../../utils'
import type { CommandHandler } from '../types'

export const setupRemoveHandler: CommandHandler = async ({ interaction, context: { locale } }) => {
  const isRemoveFleetCarrier = interaction.options.getBoolean('fleet_carrier') || false

  if (!isRemoveFleetCarrier) {
    await interaction.editReply(L[locale].setup.remove.noOption())
    return
  }

  const existingCarrier = await Prisma.fleetCarrier.findUnique({
    where: {
      userId: interaction.user.id,
    },
  })

  if (!existingCarrier) {
    await interaction.editReply(L[locale].setup.remove.fleetCarrierNotFound())
    return
  }

  await Prisma.fleetCarrier.delete({
    where: {
      userId: interaction.user.id,
    },
  })

  await interaction.editReply(L[locale].setup.remove.fleetCarrierRemoved())
}
