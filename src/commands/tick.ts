import { SlashCommandBuilder } from '@discordjs/builders'
import { Dayjs } from 'dayjs'
import { CacheType, Client, CommandInteraction, TextChannel } from 'discord.js'
import i18next from 'i18next'
import { tickReportChannel } from '../../config.json'
import { Tick, TickFetchError } from '../classes'
import { CommandNames } from '../constants'
import { createEmbed } from '../utils'
import logger from '../utils/logger'

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
      throw new TickFetchError()
    }

    await interaction.editReply({
      embeds: [createTickEmbed(tickTime, SavedTick)],
    })
  },
  reportTick: async (client: Client, SavedTick: Tick) => {
    const tickTime = SavedTick.getLocalTicktime()
    if (!tickTime) {
      logger.error('Error while trying to report tick')
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
