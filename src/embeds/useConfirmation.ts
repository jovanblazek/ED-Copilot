import type {
  ButtonInteraction,
  CacheType,
  ChatInputCommandInteraction,
  MessageActionRowComponentBuilder,
  WebhookMessageEditOptions,
} from 'discord.js'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js'
import L from '../i18n/i18n-node'
import type { Locales } from '../i18n/i18n-types'
import logger from '../utils/logger'

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

interface UseConfirmationProps {
  interaction: ChatInputCommandInteraction<CacheType>
  locale: Locales
  confirmation: WebhookMessageEditOptions
  onConfirm: (buttonInteraction: ButtonInteraction<CacheType>) => Promise<void>
  onCancel: (buttonInteraction: ButtonInteraction<CacheType>) => Promise<void>
}

export const useConfirmation = async ({
  interaction,
  locale,
  confirmation,
  onConfirm,
  onCancel,
}: UseConfirmationProps) => {
  const reply = await interaction.editReply({
    ...confirmation,
    components: [createConfirmationButtons()],
  })

  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: BUTTON_INTERACTION_TIME,
  })

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  collector.on('collect', async (buttonInteraction) => {
    try {
      if (buttonInteraction.user.id === interaction.user.id) {
        if (buttonInteraction.customId === ButtonNames.YES) {
          await onConfirm(buttonInteraction)
        } else {
          await onCancel(buttonInteraction)
        }
      } else {
        await buttonInteraction.reply({
          content: L[locale].error.buttonsDisabled(),
          ephemeral: true,
        })
      }
    } catch (error) {
      logger.error(error)
      await buttonInteraction.reply({
        content: L[locale].error.unknown(),
        ephemeral: true,
      })
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  collector.on('end', async () => {
    const { embeds } = await interaction.fetchReply()
    await interaction.editReply({
      embeds,
      components: [],
    })
  })
}
