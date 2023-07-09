import { SlashCommandBuilder } from 'discord.js'
import { CommandNames } from '../constants'
import { createEmbed } from '../embeds'
import L from '../i18n/i18n-node'
import { getTickDifferenceFromNow, getTickTime, wasTickToday } from '../utils'
import { Command } from './types'

const TickCommand: Command = {
  builder: new SlashCommandBuilder()
    .setName(CommandNames.tick)
    .setDescription('Gets latest tick time'),
  handler: async ({ interaction, context: { locale } }) => {
    await interaction.deferReply()

    const tickTime = await getTickTime({ locale, localTimezone: 'Europe/Berlin' })
    const wasToday = wasTickToday({
      tickTime,
      localTimezone: 'Europe/Berlin', // TODO change, add to context next to locale
    })

    const differenceFromNow = getTickDifferenceFromNow({ tickTime })

    await interaction.editReply({
      embeds: [
        createEmbed({
          title: L[locale].tick.title(),
          description: `**${tickTime.format('DD.MM.YYYY HH:mm')}**
            ${differenceFromNow}\n
            ${L[locale].tick.wasToday()}: ${wasToday ? '✅' : '❌'}\n
            [${L[locale].tick.history()}](https://elitebgs.app/tick)`,
        }),
      ],
    })
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
