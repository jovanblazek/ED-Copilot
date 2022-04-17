import { SlashCommandBuilder } from '@discordjs/builders'
import { CacheType, CommandInteraction, Message } from 'discord.js'
import got from 'got'
import i18next from 'i18next'
import { JSDOM } from 'jsdom'
import { chunk } from 'lodash'
import { CommandNames, DIVIDER } from '../constants'
import { createEmbed, createPaginationButtons, usePagination } from '../utils'

const CELLS_PER_ROW = 8
const PAGE_COUNT = 3
const ROWS_PER_PAGE = 5

type BrokerData = {
  system: string
  station: string
  type: string
  distanceLs: string
  distanceLy: string
}

const getBrokerData = async (url: string) => {
  const website = await got(url)
  const dom = new JSDOM(website.body)

  const tableCells = dom.window.document.querySelectorAll('td')
  if (tableCells.length === 0) {
    console.log('No table cells found')
    return []
  }

  const rows: NodeListOf<HTMLTableCellElement>[] = chunk(tableCells, CELLS_PER_ROW)

  const data: BrokerData[] = rows.map((row) => ({
    type: row[0].textContent ?? '',
    station: row[1].textContent ?? '',
    system: (row[2].textContent ?? '').slice(0, -2), // remove copy icon
    distanceLs: row[6].textContent ?? '',
    distanceLy: row[7].textContent ?? '',
  }))

  return data
}

const generateEmbed = (url: string, data: BrokerData[]) => {
  const embed = createEmbed({
    title: i18next.t('techBroker.title'),
    description: `[INARA](${url})\n${DIVIDER}`,
  })

  data.forEach(({ type, station, system, distanceLs, distanceLy }) => {
    embed.addField(`${type} - ${system}`, `${station} - ${distanceLs}\n\`${distanceLy}\`\n`)
  })
  return embed
}

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
    const url = `https://inara.cz/nearest-stations/?ps1=${systemNameWeb}&pi13=&pi14=0&pi15=0&pi16=&pi1=0&pi18=0&pi19=0&pa1%5B26%5D=1&pi8=&pi9=0&pi3=&pi4=0&pi5=0&pi6=0&pi7=0&pi23=0`

    const parsedData = await getBrokerData(url)

    if (parsedData.length === 0) {
      await interaction.editReply({
        content: i18next.t('error.systemNotFound', { systemName }),
      })
      return
    }

    const chunks: BrokerData[][] = chunk(parsedData, ROWS_PER_PAGE)
    const pages = chunks.slice(0, PAGE_COUNT)
    const pagesLength = pages.length

    await interaction.editReply({
      embeds: [generateEmbed(url, pages[0])],
      components: [createPaginationButtons(0, pagesLength)],
    })

    usePagination({
      interaction,
      reply: (await interaction.fetchReply()) as Message,
      paginationlenght: pagesLength,
      onPageChange: async (buttonInteraction, activePageIndex) => {
        await buttonInteraction.update({
          embeds: [generateEmbed(url, pages[activePageIndex])],
          components: [createPaginationButtons(activePageIndex, pagesLength)],
        })
      },
    })
  },
}
