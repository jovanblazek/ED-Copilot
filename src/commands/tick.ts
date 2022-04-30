import { SlashCommandBuilder } from '@discordjs/builders'
import { Dayjs } from 'dayjs'
import { Client, TextChannel } from 'discord.js'
import i18next from 'i18next'
import { tickReportChannel } from '../../config.json'
import { Tick, TickCommand, TickFetchError } from '../classes'
import { CommandNames } from '../constants'
import { createEmbed } from '../utils'
import logger from '../utils/logger'

const createTickEmbed = (tickTime: Dayjs, tick: Tick) =>
  createEmbed({
    title: i18next.t('tick.title'),
    description: `**${tickTime.format('DD.MM.YYYY HH:mm')}**
      ${tick.differenceFrom()}\n
      ${i18next.t('tick.wasToday')}: ${tick.wasTickToday() ? '✅' : '❌'}\n
      [${i18next.t('tick.history')}](https://elitebgs.app/tick)`,
  })

export default new TickCommand(
  {
    name: CommandNames.tick,
  },
  new SlashCommandBuilder().setName(CommandNames.tick).setDescription('Gets latest tick time'),
  async ({ interaction, tick }) => {
    await interaction.deferReply()

    const tickTime = tick.getLocalTicktime()
    if (!tickTime) {
      throw new TickFetchError()
    }

    await interaction.editReply({
      embeds: [createTickEmbed(tickTime, tick)],
    })
  },
  async (client: Client, tick: Tick) => {
    const tickTime = tick.getLocalTicktime()
    if (!tickTime) {
      logger.error('Error while trying to report tick')
      return
    }

    const channel = client.channels.cache.get(tickReportChannel) as TextChannel
    if (!channel) {
      return
    }
    await channel.send({
      embeds: [createTickEmbed(tickTime, tick)],
    })
  }
)
