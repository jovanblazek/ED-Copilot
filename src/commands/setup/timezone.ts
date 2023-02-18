import dayjs from 'dayjs'
import advancedFormatPlugin from 'dayjs/plugin/advancedFormat'
import timezonePlugin from 'dayjs/plugin/timezone'
import L from '../../i18n/i18n-node'
import { createEmbed, Prisma, useConfirmation } from '../../utils'
import { CommandHandler } from '../types'

dayjs.extend(timezonePlugin)
dayjs.extend(advancedFormatPlugin)

export const setupTimezoneHandler: CommandHandler = async ({
  interaction,
  context: { locale },
}) => {
  const timezone = interaction.options.getString('timezone') || 'UTC'

  try {
    void useConfirmation({
      interaction,
      locale,
      confirmation: {
        embeds: [
          createEmbed({
            title: L[locale].setup.timezone.confirm.title(),
            description: L[locale].setup.timezone.confirm.description({
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
          content: L[locale].setup.timezone.saved(),
          embeds: [],
          components: [],
        })
      },
      onCancel: async (buttonInteraction) => {
        await buttonInteraction.update({
          content: L[locale].setup.timezone.canceled(),
          embeds: [],
          components: [],
        })
      },
    })
  } catch {
    await interaction.editReply(L[locale].setup.timezone.notFound())
  }
}
