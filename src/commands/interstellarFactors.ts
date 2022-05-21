import { SlashCommandBuilder } from '@discordjs/builders'
import { Message } from 'discord.js'
import i18next from 'i18next'
import { chunk } from 'lodash'
import { Command } from '../classes'
import { CommandNames } from '../constants'
import {
  createPaginationButtons,
  generateInaraEmbed,
  ScrapedInaraData,
  scrapeInara,
  usePagination,
} from '../utils'

const CELLS_PER_ROW = 7
const PAGE_COUNT = 3
const ROWS_PER_PAGE = 5

export default new Command(
  {
    name: CommandNames.interstellarFactors,
  },
  new SlashCommandBuilder()
    .setName(CommandNames.interstellarFactors)
    .setDescription('Gets nearest interstellar factors')
    .addStringOption((option) =>
      option.setName('system').setDescription('Your location').setRequired(true)
    ),
  async ({ interaction }) => {
    await interaction.deferReply()
    const systemName = interaction.options.getString('system') || 'Sol'
    const systemNameWeb = encodeURIComponent(systemName)
    const url = `https://inara.cz/nearest-stations/?ps1=${systemNameWeb}&pi13=&pi14=0&pi15=0&pi16=&pi1=0&pi18=3&pi19=2000&pi17=1&pi2=1&pa1%5B18%5D=1&pi8=&pi9=0&pi3=&pi4=0&pi5=0&pi6=0&pi7=0&pi23=0`

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
      reply: (await interaction.fetchReply()) as Message,
      paginationlenght: pagesLength,
      onPageChange: async (buttonInteraction, activePageIndex) => {
        await buttonInteraction.update({
          embeds: [generateInaraEmbed(url, pages[activePageIndex], 'interstellarFactors.title')],
          components: [createPaginationButtons(activePageIndex, pagesLength)],
        })
      },
    })
  }
)
