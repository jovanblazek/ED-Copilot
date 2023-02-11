import { Dayjs } from 'dayjs'
import { SlashCommandBuilder } from 'discord.js'
import { Tick, TickFetchError } from '../classes'
import { CommandNames } from '../constants'
import L from '../i18n/i18n-node'
import { Locales } from '../i18n/i18n-types'
import { createEmbed } from '../utils'
import { Command } from './types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createTickEmbed = (tickTime: Dayjs, tick: Tick, locale: Locales) =>
  createEmbed({
    title: L[locale].tick.title(),
    description: `**${tickTime.format('DD.MM.YYYY HH:mm')}**
      ${tick.differenceFrom()}\n
      ${L[locale].tick.wasToday()}: ${tick.wasTickToday() ? '✅' : '❌'}\n
      [${L[locale].tick.history()}](https://elitebgs.app/tick)`,
  })

const TickCommand: Command = {
  builder: new SlashCommandBuilder()
    .setName(CommandNames.tick)
    .setDescription('Gets latest tick time'),
  handler: async ({ interaction, context: { locale } }) => {
    await interaction.deferReply()

    const tickTime = null
    if (!tickTime) {
      throw new TickFetchError({ locale })
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
