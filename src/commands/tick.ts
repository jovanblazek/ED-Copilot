import { SlashCommandBuilder } from '@discordjs/builders'
import { Dayjs } from 'dayjs'
import { CacheType, Client, CommandInteraction, TextChannel } from 'discord.js'
import i18next from 'i18next'
import { tickReportChannel } from '../../config.json'
import { CommandNames } from '../constants'
import { Tick } from '../data/Tick'
import { createEmbed } from '../utils'

const createTickEmbed = (tickTime: Dayjs, SavedTick: Tick) =>
  createEmbed({
    title: i18next.t('tick.title'),
    description: `**${tickTime.format('DD.MM.YYYY HH:mm')}**
      ${SavedTick.differenceFrom()}\n
      ${i18next.t('tick.wasToday')}: ${SavedTick.wasTickToday() ? '✅' : '❌'}\n
      [${i18next.t('tick.history')}](https://elitebgs.app/tick)`,
  })

export default {
  name: CommandNames.tick,
  command: new SlashCommandBuilder()
    .setName(CommandNames.tick)
    .setDescription('Gets latest tick time'),
  handler: async (interaction: CommandInteraction<CacheType>, SavedTick: Tick) => {
    await interaction.deferReply()

    const tickTime = SavedTick.getLocalTicktime()
    if (!tickTime) {
      await interaction.editReply({
        content: i18next.t('error.tickFetchingError'),
      })
      return
    }

    await interaction.editReply({
      embeds: [createTickEmbed(tickTime, SavedTick)],
    })
  },
  reportTick: async (client: Client, SavedTick: Tick) => {
    const tickTime = SavedTick.getLocalTicktime()
    if (!tickTime) {
      console.log('Error while trying to report tick')
      return
    }

    const channel = client.channels.cache.get(tickReportChannel) as TextChannel
    if (!channel) {
      return
    }
    await channel.send({
      embeds: [createTickEmbed(tickTime, SavedTick)],
    })
  },
}
