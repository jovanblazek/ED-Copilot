import L from '../../i18n/i18n-node'
import { Prisma } from '../../utils'
import { loadTrackedFactionsFromDBToRedis } from '../../utils/redis'
import type { CommandHandler } from '../types'

export const copilotClearHandler: CommandHandler = async ({ interaction, context: { locale } }) => {
  const { guildId } = interaction
  if (!guildId) {
    return // We should never get here as this check is done in the parent command
  }

  const isClearFaction = interaction.options.getBoolean('faction')
  const isClearTickReportChannel = interaction.options.getBoolean('tick')

  if (!isClearFaction && !isClearTickReportChannel) {
    await interaction.editReply(L[locale].copilot.clear.nothing())
    return
  }
  const response = []

  if (isClearFaction) {
    await Prisma.guildFaction
      .delete({
        where: { guildId },
      })
      .catch(() => {
        // Ignore if the guild faction is not set
      })
    await loadTrackedFactionsFromDBToRedis()
    response.push(L[locale].copilot.clear.faction())
  }

  if (isClearTickReportChannel) {
    await Prisma.guild.update({
      where: { id: guildId },
      data: { tickReportChannelId: null },
    })
    response.push(L[locale].copilot.clear.tickReportChannel())
  }

  await interaction.editReply(response.join('\n'))
}
