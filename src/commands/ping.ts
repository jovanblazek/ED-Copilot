import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  MessageActionRowComponentBuilder,
  SlashCommandBuilder,
} from 'discord.js'
import i18next from 'i18next'
import { Command } from '../classes'
import { CommandNames } from '../constants'

export default new Command(
  {
    name: CommandNames.ping,
  },
  new SlashCommandBuilder()
    .setName(CommandNames.ping)
    .setDescription('Replies with pong!')
    .addNumberOption((option) =>
      option.setName('number').setDescription('The number to ping').setRequired(true)
    ),
  async ({ interaction }) => {
    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      new ButtonBuilder().setCustomId('left').setLabel('Left').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('right').setLabel('Right').setStyle(ButtonStyle.Primary)
    )

    // FIXME
    // @ts-ignore
    const number = (interaction.options.getNumber('number') as number) || 0

    const reply = await interaction.reply({
      content: `Pong dude! ${number} ${i18next.t('ping.response')}`,
      components: [row],
      fetchReply: true,
    })

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
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
  }
)
