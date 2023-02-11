import { CacheType, ChatInputCommandInteraction } from 'discord.js'
import i18next from 'i18next'
import { encrypt, Prisma } from '../../utils'

export const setupProfileHandler = async (interaction: ChatInputCommandInteraction<CacheType>) => {
  const cmdrName = interaction.options.getString('name')!
  const edsmApiKeyRaw = interaction.options.getString('edsm_api_key') || null
  const edsmApiKey = edsmApiKeyRaw ? encrypt(edsmApiKeyRaw) : null

  await Prisma.user.upsert({
    where: {
      userId: interaction.user.id,
    },
    create: {
      userId: interaction.user.id,
      cmdrName,
      edsmApiKey,
    },
    update: {
      cmdrName,
      edsmApiKey,
    },
  })

  await interaction.editReply(i18next.t('setup.profile.saved'))
}
