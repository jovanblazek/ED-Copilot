import dayjs from 'dayjs'
import advancedFormatPlugin from 'dayjs/plugin/advancedFormat'
import timezonePlugin from 'dayjs/plugin/timezone'
import { createEmbed, useConfirmation } from '../../embeds'
import L from '../../i18n/i18n-node'
import { Prisma } from '../../utils'
import type { CommandHandler } from '../types'

dayjs.extend(timezonePlugin)
dayjs.extend(advancedFormatPlugin)

export const copilotTimezoneHandler: CommandHandler = async ({
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
            title: L[locale].copilot.timezone.confirm.title(),
            description: L[locale].copilot.timezone.confirm.description({
              currentTime: dayjs().tz(timezone).format('YYYY-MM-DD HH:mm:ss'),
            }),
          }),
        ],
      },
      onConfirm: async (buttonInteraction) => {
        await Prisma.guild.upsert({
          where: { id: interaction.guildId! },
          create: { id: interaction.guildId!, timezone },
          update: { timezone },
        })

        await buttonInteraction.update({
          content: L[locale].copilot.timezone.saved(),
          embeds: [],
          components: [],
        })
      },
      onCancel: async (buttonInteraction) => {
        await buttonInteraction.update({
          content: L[locale].copilot.timezone.canceled(),
          embeds: [],
          components: [],
        })
      },
    })
  } catch {
    await interaction.editReply(L[locale].copilot.timezone.notFound())
  }
}
