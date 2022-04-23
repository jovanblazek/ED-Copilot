import { SlashCommandBuilder } from '@discordjs/builders'
import { Dayjs } from 'dayjs'
import { CacheType, Client, CommandInteraction, TextChannel } from 'discord.js'
import i18next from 'i18next'
import { tickReportChannel } from '../../config.json'
import { Tick, TickFetchError } from '../classes'
import { CommandNames } from '../constants'
import { createEmbed } from '../utils'
import logger from '../utils/logger'

const createTickEmbed = (tickTime: Dayjs, CachedTick: Tick) =>
  createEmbed({
    title: i18next.t('tick.title'),
    description: `**${tickTime.format('DD.MM.YYYY HH:mm')}**
      ${CachedTick.differenceFrom()}\n
      ${i18next.t('tick.wasToday')}: ${CachedTick.wasTickToday() ? '✅' : '❌'}\n
      [${i18next.t('tick.history')}](https://elitebgs.app/tick)`,
  })

export default {
  name: CommandNames.tick,
  command: new SlashCommandBuilder()
    .setName(CommandNames.tick)
    .setDescription('Gets latest tick time'),
  handler: async (interaction: CommandInteraction<CacheType>, CachedTick: Tick) => {
    await interaction.deferReply()

    const tickTime = CachedTick.getLocalTicktime()
    if (!tickTime) {
      throw new TickFetchError()
    }

    await interaction.editReply({
      embeds: [createTickEmbed(tickTime, CachedTick)],
    })
  },
  reportTick: async (client: Client, CachedTick: Tick) => {
    const tickTime = CachedTick.getLocalTicktime()
    if (!tickTime) {
      logger.error('Error while trying to report tick')
      return
    }

    const channel = client.channels.cache.get(tickReportChannel) as TextChannel
    if (!channel) {
      return
    }
    await channel.send({
      embeds: [createTickEmbed(tickTime, CachedTick)],
    })
  },
}
