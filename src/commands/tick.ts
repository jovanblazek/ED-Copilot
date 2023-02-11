import { Dayjs } from 'dayjs'
import { SlashCommandBuilder } from 'discord.js'
import i18next from 'i18next'
import { Tick, TickFetchError } from '../classes'
import { CommandNames } from '../constants'
import { createEmbed } from '../utils'
import { Command } from './types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createTickEmbed = (tickTime: Dayjs, tick: Tick) =>
  createEmbed({
    title: i18next.t('tick.title'),
    description: `**${tickTime.format('DD.MM.YYYY HH:mm')}**
      ${tick.differenceFrom()}\n
      ${i18next.t('tick.wasToday')}: ${tick.wasTickToday() ? '✅' : '❌'}\n
      [${i18next.t('tick.history')}](https://elitebgs.app/tick)`,
  })

const TickCommand: Command = {
  builder: new SlashCommandBuilder()
    .setName(CommandNames.tick)
    .setDescription('Gets latest tick time'),
  handler: async ({ interaction }) => {
    await interaction.deferReply()

    const tickTime = null
    if (!tickTime) {
      throw new TickFetchError()
    }

    // await interaction.editReply({
    //   embeds: [createTickEmbed(tickTime)],
    // })
  },
  // async (client: Client) => {
  //   const tickTime = null
  //   if (!tickTime) {
  //     logger.error('Error while trying to report tick')
  //     // return
  //   }

  //   // const channel = client.channels.cache.get(tickReportChannel) as TextChannel
  //   // if (!channel) {
  //   //   return
  //   // }
  //   // await channel.send({
  //   //   embeds: [createTickEmbed(tickTime, tick)],
  //   // })
  // }
}

export default TickCommand
