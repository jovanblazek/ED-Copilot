import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CacheType,
  ChatInputCommandInteraction,
  ComponentType,
  Message,
  MessageActionRowComponentBuilder,
} from 'discord.js'
import { PAGINATION_COLLECTION_TIME, PaginationButtonNames } from '../constants'
import L from '../i18n/i18n-node'
import { Locales } from '../i18n/i18n-types'

interface UsePaginationProps {
  interaction: ChatInputCommandInteraction<CacheType>
  locale: Locales
  reply: Message
  paginationlenght: number
  time?: number
  onPageChange: (
    buttonInteraction: ButtonInteraction<CacheType>,
    activePageIndex: number
  ) => Promise<void>
  onEnd?: () => Promise<void>
}

export const usePagination = ({
  interaction,
  locale,
  reply,
  paginationlenght,
  time = PAGINATION_COLLECTION_TIME,
  onPageChange,
  onEnd,
}: UsePaginationProps) => {
  let activePageIndex = 0
  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time,
  })
  collector.on('collect', async (buttonInteraction) => {
    if (buttonInteraction.user.id === interaction.user.id) {
      if (buttonInteraction.customId === PaginationButtonNames.LEFT && activePageIndex > 0) {
        activePageIndex -= 1
      } else if (
        buttonInteraction.customId === PaginationButtonNames.RIGHT &&
        activePageIndex < paginationlenght - 1
      ) {
        activePageIndex += 1
      }
      await onPageChange(buttonInteraction, activePageIndex)
    } else {
      await buttonInteraction.reply({
        content: L[locale].error.buttonsDisabled(),
        ephemeral: true,
      })
    }
  })

  // removes buttons when done collecting
  collector.on('end', async () => {
    if (onEnd) {
      await onEnd()
      return
    }
    const { embeds } = await interaction.fetchReply()
    await interaction.editReply({
      embeds,
      components: [],
    })
  })
}

export const createPaginationButtons = (activePage: number, pagesLength: number) =>
  new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(PaginationButtonNames.LEFT)
      .setLabel('◀')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(activePage === 0),
    new ButtonBuilder()
      .setCustomId(PaginationButtonNames.RIGHT)
      .setLabel('▶')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(activePage === pagesLength - 1)
  )
