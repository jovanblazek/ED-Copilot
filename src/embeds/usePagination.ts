import type {
  CacheType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
} from 'discord.js'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js'
import { PAGINATION_COLLECTION_TIME, PaginationButtonNames } from '../constants'
import L from '../i18n/i18n-node'
import type { Locales } from '../i18n/i18n-types'
import logger from '../utils/logger'

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

interface UsePaginationProps {
  interaction: ChatInputCommandInteraction<CacheType>
  locale: Locales
  time?: number
  embeds: EmbedBuilder[]
}

export const usePagination = async ({
  interaction,
  locale,
  time = PAGINATION_COLLECTION_TIME,
  embeds,
}: UsePaginationProps) => {
  let activePageIndex = 0
  const paginationLength = embeds.length
  const isOnlyOnePage = paginationLength === 1
  const reply = await interaction.editReply({
    embeds: [embeds[activePageIndex]],
    components: isOnlyOnePage
      ? undefined
      : [createPaginationButtons(activePageIndex, paginationLength)],
  })
  if (isOnlyOnePage) {
    return
  }

  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time,
  })

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  collector.on('collect', async (buttonInteraction) => {
    try {
      if (buttonInteraction.user.id === interaction.user.id) {
        if (buttonInteraction.customId === PaginationButtonNames.LEFT && activePageIndex > 0) {
          activePageIndex -= 1
        } else if (
          buttonInteraction.customId === PaginationButtonNames.RIGHT &&
          activePageIndex < paginationLength - 1
        ) {
          activePageIndex += 1
        }
        await buttonInteraction.update({
          embeds: [embeds[activePageIndex]],
          components: [createPaginationButtons(activePageIndex, paginationLength)],
        })
      } else {
        await buttonInteraction.reply({
          content: L[locale].error.buttonsDisabled(),
          ephemeral: true,
        })
      }
    } catch (error) {
      logger.error(error, 'Error while collecting pagination buttons')
    }
  })

  // removes buttons when done collecting
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  collector.on('end', async () => {
    try {
      await interaction.editReply({
        embeds: [embeds[activePageIndex]],
        components: [],
      })
    } catch (error) {
      logger.warn(error, 'Error while removing pagination buttons')
    }
  })
}
