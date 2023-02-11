import { SlashCommandBuilder } from 'discord.js'
import i18next from 'i18next'
import { chunk } from 'lodash'
import { CommandNames } from '../constants'
import {
  createPaginationButtons,
  generateInaraEmbed,
  ScrapedInaraData,
  scrapeInara,
  usePagination,
} from '../utils'
import { Command } from './types'

const CELLS_PER_ROW = 7
const PAGE_COUNT = 3
const ROWS_PER_PAGE = 5

const InterstellarFactors: Command = {
  builder: new SlashCommandBuilder()
    .setName(CommandNames.interstellarFactors)
    .setDescription('Gets nearest interstellar factors')
    .addStringOption((option) =>
      option.setName('system').setDescription('Your location').setRequired(true)
    ),
  handler: async ({ interaction }) => {
    await interaction.deferReply()
    const systemName = interaction.options.getString('system') || 'Sol'
    const systemNameWeb = encodeURIComponent(systemName)
    const url = `https://inara.cz/elite/nearest-stations/?formbrief=1&ps1=${systemNameWeb}&pi13=&pi14=0&pi15=0&pi16=&pi1=0&pi18=3&pi19=2000&pi17=2&pi2=1&pa1%5B%5D=18&ps2=&pi8=&pi9=0&pi3=&pi4=0&pi5=0&pi6=0&pi7=0&pi23=0&ps3=`
    const parsedData = await scrapeInara(url, CELLS_PER_ROW)

    if (parsedData.length === 0) {
      await interaction.editReply({
        content: i18next.t('error.systemNotFound', { systemName }),
      })
      return
    }

    const chunks: ScrapedInaraData[][] = chunk(parsedData, ROWS_PER_PAGE)
    const pages = chunks.slice(0, PAGE_COUNT)
    const pagesLength = pages.length

    await interaction.editReply({
      embeds: [generateInaraEmbed(url, pages[0], 'interstellarFactors.title')],
      components: [createPaginationButtons(0, pagesLength)],
    })

    usePagination({
      interaction,
      reply: await interaction.fetchReply(),
      paginationlenght: pagesLength,
      onPageChange: async (buttonInteraction, activePageIndex) => {
        await buttonInteraction.update({
          embeds: [generateInaraEmbed(url, pages[activePageIndex], 'interstellarFactors.title')],
          components: [createPaginationButtons(activePageIndex, pagesLength)],
        })
      },
    })
  },
}

export default InterstellarFactors
