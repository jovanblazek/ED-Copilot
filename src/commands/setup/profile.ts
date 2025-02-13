import L from '../../i18n/i18n-node'
import { encrypt, Prisma } from '../../utils'
import type { CommandHandler } from '../types'

export const setupProfileHandler: CommandHandler = async ({ interaction, context: { locale } }) => {
  const cmdrName = interaction.options.getString('name')!
  const edsmApiKeyRaw = interaction.options.getString('edsm_api_key') || null
  const edsmApiKey = edsmApiKeyRaw ? encrypt(edsmApiKeyRaw) : null

  await Prisma.user.upsert({
    where: {
      id: interaction.user.id,
    },
    create: {
      id: interaction.user.id,
      cmdrName,
      edsmApiKey,
    },
    update: {
      cmdrName,
      edsmApiKey,
    },
  })

  await interaction.editReply(L[locale].setup.profile.saved())
}
