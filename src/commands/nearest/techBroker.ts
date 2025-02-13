import { chunk } from 'lodash'
import { SystemNotFoundError } from '../../classes'
import { usePagination } from '../../embeds'
import L from '../../i18n/i18n-node'
import type { ScrapedInaraData } from '../../utils'
import { generateInaraEmbed, scrapeInara } from '../../utils'
import type { CommandHandler } from '../types'
import { PARAMS } from './constants'

const CELLS_PER_ROW = 8
const PAGE_COUNT = 3
const ROWS_PER_PAGE = 5

export const nearestTechBrokerHandler: CommandHandler = async ({
  interaction,
  context: { locale },
}) => {
  await interaction.deferReply()
  const systemName = interaction.options.getString(PARAMS.system) || 'Sol'
  const systemNameWeb = encodeURIComponent(systemName)
  const url = `https://inara.cz/elite/nearest-stations/?formbrief=1&ps1=${systemNameWeb}&pi13=&pi14=0&pi15=0&pi16=&pi1=0&pi18=0&pi19=2000&pi17=2&pi2=1&pa1%5B%5D=26&ps2=&pi25=0&pi8=&pi9=0&pi26=0&pi3=&pi4=0&pi5=0&pi7=0&pi23=0&pi6=0&ps3=&pi24=0`

  const parsedData = await scrapeInara(url, CELLS_PER_ROW)

  if (parsedData.length === 0) {
    throw new SystemNotFoundError({ locale, systemName })
  }

  const chunks: ScrapedInaraData[][] = chunk(parsedData, ROWS_PER_PAGE)
  const pages = chunks.slice(0, PAGE_COUNT)

  await usePagination({
    interaction,
    locale,
    embeds: pages.map((page) => generateInaraEmbed(url, page, L[locale].techBroker.title())),
  })
}
