import dayjs from 'dayjs'
import advancedFormatPlugin from 'dayjs/plugin/advancedFormat'
import timezonePlugin from 'dayjs/plugin/timezone'
import { CacheType, ChatInputCommandInteraction } from 'discord.js'
import i18next from 'i18next'
import { createEmbed, Prisma, useConfirmation } from '../../utils'

dayjs.extend(timezonePlugin)
dayjs.extend(advancedFormatPlugin)

export const setupTimezoneHandler = async (interaction: ChatInputCommandInteraction<CacheType>) => {
  const timezone = interaction.options.getString('timezone') || 'UTC'

  try {
    void useConfirmation({
      interaction,
      confirmation: {
        embeds: [
          createEmbed({
            title: i18next.t('setup.timezone.confirm.title'),
            description: i18next.t('setup.timezone.confirm.description', {
              currentTime: dayjs().tz(timezone).format('YYYY-MM-DD HH:mm:ss'),
            }),
          }),
        ],
      },
      onConfirm: async (buttonInteraction) => {
        await Prisma.preferences.upsert({
          where: { guildId: interaction.guildId! },
          create: { guildId: interaction.guildId!, timezone },
          update: { timezone },
        })

        await buttonInteraction.update({
          content: i18next.t('setup.timezone.saved'),
          embeds: [],
          components: [],
        })
      },
      onCancel: async (buttonInteraction) => {
        await buttonInteraction.update({
          content: i18next.t('setup.timezone.canceled'),
          embeds: [],
          components: [],
        })
      },
    })
  } catch {
    await interaction.editReply(i18next.t('setup.timezone.notFound'))
  }
}
