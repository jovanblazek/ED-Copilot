import got from 'got'
import i18next from 'i18next'
import { JSDOM } from 'jsdom'
import { chunk } from 'lodash'
import { DIVIDER } from '../constants'
import { createEmbed } from './embed'

/**
 * Contains data scraped from Inara.cz. Used for commands broker, trader, factors.
 */
export type InaraData = {
  type: string | null
  station: string
  system: string
  distanceLs: string
  distanceLy: string
}

export const getInaraData = async (url: string, cellsPerRow: number) => {
  const website = await got(url)
  const dom = new JSDOM(website.body)

  const tableCells = dom.window.document.querySelectorAll('td')
  if (tableCells.length === 0) {
    return []
  }

  const rows = chunk(tableCells, cellsPerRow)

  const data: InaraData[] = rows.map((row) => ({
    type: cellsPerRow === 8 ? row[0].textContent : null,
    station: row[cellsPerRow === 8 ? 1 : 0].textContent ?? '',
    system: (row[cellsPerRow === 8 ? 2 : 1].textContent ?? '').slice(0, -2), // remove copy icon
    distanceLs: row[cellsPerRow - 2].textContent ?? '',
    distanceLy: row[cellsPerRow - 1].textContent ?? '',
  }))

  return data
}

export const generateInaraEmbed = (url: string, data: InaraData[], title: string) => {
  const embed = createEmbed({
    title: i18next.t(title),
    description: `[INARA](${url})\n${DIVIDER}`,
  })

  data.forEach(({ type, station, system, distanceLs, distanceLy }) => {
    embed.addField(
      `${type ? `${type} - ` : ''}${system}`,
      `${station} - ${distanceLs}\n\`${distanceLy}\`\n`
    )
  })
  return embed
}
