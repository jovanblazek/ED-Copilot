import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CacheType,
  CommandInteraction,
  ComponentType,
  MessageActionRowComponentBuilder,
  WebhookEditMessageOptions,
} from 'discord.js'
import i18next from 'i18next'

const BUTTON_INTERACTION_TIME = 20000
const ButtonNames = {
  YES: 'yes',
  NO: 'no',
}

const createConfirmationButtons = () =>
  new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new ButtonBuilder().setCustomId(ButtonNames.YES).setLabel('✔').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId(ButtonNames.NO).setLabel('✘').setStyle(ButtonStyle.Danger)
  )

interface IUseConfirmation {
  interaction: CommandInteraction<CacheType>
  confirmation: WebhookEditMessageOptions
  onConfirm: (buttonInteraction: ButtonInteraction<CacheType>) => Promise<void>
  onCancel: (buttonInteraction: ButtonInteraction<CacheType>) => Promise<void>
}

export const useConfirmation = async ({
  interaction,
  confirmation,
  onConfirm,
  onCancel,
}: IUseConfirmation) => {
  const reply = await interaction.editReply({
    ...confirmation,
    components: [createConfirmationButtons()],
  })

  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: BUTTON_INTERACTION_TIME,
  })

  collector.on('collect', async (buttonInteraction) => {
    if (buttonInteraction.user.id === interaction.user.id) {
      if (buttonInteraction.customId === ButtonNames.YES) {
        await onConfirm(buttonInteraction)
      } else {
        await onCancel(buttonInteraction)
      }
    } else {
      await buttonInteraction.reply({
        content: i18next.t('error.buttonsDisabled'),
        ephemeral: true,
      })
    }
  })

  collector.on('end', async () => {
    const { embeds } = await interaction.fetchReply()
    await interaction.editReply({
      embeds,
      components: [],
    })
  })
}
