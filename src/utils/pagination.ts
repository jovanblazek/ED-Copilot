import {
  ButtonInteraction,
  CacheType,
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
} from 'discord.js'
import { PAGINATION_COLLECTION_TIME, PaginationButtonNames } from '../constants'

interface IUsePagination {
  interaction: CommandInteraction<CacheType>
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
  reply,
  paginationlenght,
  time = PAGINATION_COLLECTION_TIME,
  onPageChange,
  onEnd,
}: IUsePagination) => {
  let activePageIndex = 0
  const collector = reply.createMessageComponentCollector({
    componentType: 'BUTTON',
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
        content: `These buttons aren't for you!`,
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
  new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(PaginationButtonNames.LEFT)
      .setLabel('◀')
      .setStyle('PRIMARY')
      .setDisabled(activePage === 0),
    new MessageButton()
      .setCustomId(PaginationButtonNames.RIGHT)
      .setLabel('▶')
      .setStyle('PRIMARY')
      .setDisabled(activePage === pagesLength - 1)
  )
