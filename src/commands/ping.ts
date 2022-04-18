import { SlashCommandBuilder } from '@discordjs/builders'
import { CacheType, CommandInteraction, Message, MessageActionRow, MessageButton } from 'discord.js'
import i18next from 'i18next'
import { CommandNames } from '../constants'

export default {
  name: CommandNames.ping,
  command: new SlashCommandBuilder()
    .setName(CommandNames.ping)
    .setDescription('Replies with pong!')
    .addNumberOption((option) =>
      option.setName('number').setDescription('The number to ping').setRequired(true)
    ),
  handler: async (interaction: CommandInteraction<CacheType>) => {
    const row = new MessageActionRow().addComponents(
      new MessageButton().setCustomId('left').setLabel('Left').setStyle('PRIMARY'),
      new MessageButton().setCustomId('right').setLabel('Right').setStyle('PRIMARY')
    )

    const number = interaction.options.getNumber('number') || 0

    const reply = (await interaction.reply({
      content: `Pong dude! ${number} ${i18next.t('ping.response')}`,
      components: [row],
      fetchReply: true,
    })) as Message

    const collector = reply.createMessageComponentCollector({
      componentType: 'BUTTON',
      time: 10000, // 10 seconds
    })
    collector.on('collect', async (buttonInteraction) => {
      if (buttonInteraction.user.id === interaction.user.id) {
        await buttonInteraction.update({
          content: `Pong dude! ${number}, You clicked ${buttonInteraction.customId}`,
          components: [row],
        })
      } else {
        await buttonInteraction.reply({
          content: `These buttons aren't for you!`,
          ephemeral: true,
        })
      }
    })

    // removes buttons when done collecting
    collector.on('end', async () => {
      const { content } = await interaction.fetchReply()
      await interaction.editReply({
        content,
        components: [],
      })
    })
  },
}