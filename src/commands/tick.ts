import { SlashCommandBuilder } from 'discord.js'
import { CommandNames } from '../constants'
import { createEmbed } from '../embeds'
import L from '../i18n/i18n-node'
import { getTickTime, wasTickToday } from '../utils'
import { getPastTimeDifferenceFromNow } from '../utils/time'
import { Command } from './types'

const TickCommand: Command = {
  builder: new SlashCommandBuilder()
    .setName(CommandNames.tick)
    .setDescription('Gets latest tick time'),
  handler: async ({ interaction, context: { locale, timezone } }) => {
    await interaction.deferReply()

    const tickTime = await getTickTime({ locale, timezone })
    const wasToday = wasTickToday({
      tickTime,
      timezone,
    })

    const differenceFromNow = getPastTimeDifferenceFromNow({ pastTime: tickTime })

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
}

export default TickCommand
