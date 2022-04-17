import { SlashCommandBuilder } from '@discordjs/builders'
import dayjs, { Dayjs } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { CacheType, CommandInteraction } from 'discord.js'
import i18next from 'i18next'
import { CommandNames } from '../constants'
import { createEmbed, getTickTime } from '../utils'

dayjs.extend(relativeTime)

const wasTickToday = (tickTime: Dayjs) =>
  tickTime.tz('Europe/Berlin').date() === dayjs().tz('Europe/Berlin').date()

export default {
  name: CommandNames.tick,
  command: new SlashCommandBuilder()
    .setName(CommandNames.tick)
    .setDescription('Gets latest tick time'),
  handler: async (interaction: CommandInteraction<CacheType>) => {
    await interaction.deferReply()

    const tickTime = await getTickTime()
    if (!tickTime) {
      await interaction.editReply({
        content: i18next.t('error.tickFetchingError'),
      })
      return
    }

    // TODO make function to get local tick time
    const difference = tickTime.tz('Europe/Berlin').from(dayjs().tz('Europe/Berlin'))

    const embed = createEmbed({
      title: i18next.t('tick.title'),
      description: `**${tickTime.tz('Europe/Berlin').format('DD.MM.YYYY HH:mm')}**
				${difference}\n
				${i18next.t('tick.wasToday')}: ${wasTickToday(tickTime) ? '✅' : '❌'}\n
				[${i18next.t('tick.history')}](https://elitebgs.app/tick)`,
    })

    await interaction.editReply({
      embeds: [embed],
    })
  },
}
