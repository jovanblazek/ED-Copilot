import { SlashCommandBuilder } from '@discordjs/builders'
import { CacheType, CommandInteraction, Message } from 'discord.js'
import i18next from 'i18next'
import { chunk } from 'lodash'
import { CommandNames } from '../constants'
import {
  createPaginationButtons,
  generateInaraEmbed,
  getInaraData,
  InaraData,
  usePagination,
} from '../utils'

const CELLS_PER_ROW = 8
const PAGE_COUNT = 3
const ROWS_PER_PAGE = 5

export default {
  name: CommandNames.techBroker,
  command: new SlashCommandBuilder()
    .setName(CommandNames.techBroker)
    .setDescription('Gets nearest tech brokers')
    .addStringOption((option) =>
      option.setName('system').setDescription('Your location').setRequired(true)
    ),
  handler: async (interaction: CommandInteraction<CacheType>) => {
    await interaction.deferReply()
    const systemName = interaction.options.getString('system') || 'Sol'
    const systemNameWeb = encodeURIComponent(systemName)
    const url = `https://inara.cz/nearest-stations/?ps1=${systemNameWeb}&pi13=&pi14=0&pi15=0&pi16=&pi1=0&pi18=0&pi19=2000&pa1%5B26%5D=1&pi8=&pi9=0&pi3=&pi4=0&pi5=0&pi6=0&pi7=0&pi23=0`

    const parsedData = await getInaraData(url, CELLS_PER_ROW)

    if (parsedData.length === 0) {
      await interaction.editReply({
        content: i18next.t('error.systemNotFound', { systemName }),
      })
      return
    }

    const chunks: InaraData[][] = chunk(parsedData, ROWS_PER_PAGE)
    const pages = chunks.slice(0, PAGE_COUNT)
    const pagesLength = pages.length

    await interaction.editReply({
      embeds: [generateInaraEmbed(url, pages[0], 'techBroker.title')],
      components: [createPaginationButtons(0, pagesLength)],
    })

    usePagination({
      interaction,
      reply: (await interaction.fetchReply()) as Message,
      paginationlenght: pagesLength,
      onPageChange: async (buttonInteraction, activePageIndex) => {
        await buttonInteraction.update({
          embeds: [generateInaraEmbed(url, pages[activePageIndex], 'techBroker.title')],
          components: [createPaginationButtons(activePageIndex, pagesLength)],
        })
      },
    })
  },
}