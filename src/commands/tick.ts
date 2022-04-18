import { SlashCommandBuilder } from '@discordjs/builders'
import { CacheType, CommandInteraction } from 'discord.js'
import i18next from 'i18next'
import { CommandNames } from '../constants'
import { Tick } from '../data/Tick'
import { createEmbed } from '../utils'

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

    const embed = createEmbed({
      title: i18next.t('tick.title'),
      description: `**${tickTime.format('DD.MM.YYYY HH:mm')}**
				${SavedTick.differenceFrom()}\n
				${i18next.t('tick.wasToday')}: ${SavedTick.wasTickToday() ? '✅' : '❌'}\n
				[${i18next.t('tick.history')}](https://elitebgs.app/tick)`,
    })

    await interaction.editReply({
      embeds: [embed],
    })
  },
}
