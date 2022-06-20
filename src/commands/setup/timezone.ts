import dayjs from 'dayjs'
import advancedFormatPlugin from 'dayjs/plugin/advancedFormat'
import timezonePlugin from 'dayjs/plugin/timezone'
import { CacheType, CommandInteraction } from 'discord.js'
import i18next from 'i18next'
import Keyv from 'keyv'
import Preferences from '../../schemas/Preferences'
import { createEmbed, refreshGuildPreferencesCache, useConfirmation } from '../../utils'

dayjs.extend(timezonePlugin)
dayjs.extend(advancedFormatPlugin)

export const setupTimezoneHandler = async (
  interaction: CommandInteraction<CacheType>,
  cache: Keyv
) => {
  const timezone = interaction.options.getString('timezone')!

  try {
    const dummy = dayjs().tz(timezone)
    void useConfirmation({
      interaction,
      confirmation: {
        embeds: [
          createEmbed({
            title: i18next.t('setup.timezone.confirm.title'),
            description: i18next.t('setup.timezone.confirm.description', {
              currentTime: dummy.format('YYYY-MM-DD HH:mm:ss'),
            }),
          }),
        ],
      },
      onConfirm: async (buttonInteraction) => {
        await Preferences.findOneAndUpdate({ guildId: interaction.guildId }, { timezone })
        await refreshGuildPreferencesCache(cache)

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
