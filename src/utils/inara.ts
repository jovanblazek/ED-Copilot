import { hyperlink } from 'discord.js'
import got from 'got'
import { JSDOM } from 'jsdom'
import { chunk, get } from 'lodash'
import { DIVIDER, RankNames, Ranks, StationType } from '../constants'
import { createEmbed } from '../embeds'
import type { InaraEvent, InaraProfile, InaraResponse } from '../types/inara'

const INARA_API_URL = 'https://inara.cz/inapi/v1/'

const APP_NAME = 'ED-Copilot'
const APP_VERSION = '2' // should match major version of the app

export const inaraRequest = async <T>(events: InaraEvent[]) => {
  const response = await got
    .post(INARA_API_URL, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        header: {
          appName: APP_NAME,
          appVersion: APP_VERSION,
          isBeingDeveloped: process.env.NODE_ENV === 'development',
          APIkey: process.env.INARA_API_KEY,
        },
        events: events.map((event) => ({
          eventTimestamp: new Date().toISOString(),
          ...event,
        })),
      }),
    })
    .json<InaraResponse<T>>()
  return response
}

/**
 * Contains data scraped from Inara.cz. Used for commands broker, trader, factors.
 */
export type ScrapedInaraData = {
  type: string | null
  station: string
  system: string
  distanceLs: string
  distanceLy: string
}

export const scrapeInara = async (url: string, cellsPerRow: number) => {
  const website = await got(url)
  const dom = new JSDOM(website.body)

  const tableCells = dom.window.document.querySelectorAll('td')
  if (tableCells.length === 0) {
    return []
  }

  const rows = chunk(tableCells, cellsPerRow)

  const data: ScrapedInaraData[] = rows.map((row) => ({
    type: cellsPerRow === 8 ? row[0].textContent : null,
    station: row[cellsPerRow === 8 ? 1 : 0].textContent ?? '',
    system: (row[cellsPerRow === 8 ? 2 : 1].textContent ?? '').slice(0, -2), // remove copy icon
    distanceLs: row[cellsPerRow - 2].textContent ?? '',
    distanceLy: row[cellsPerRow - 1].firstChild?.nodeValue ?? '',
  }))

  return data
}

export const generateInaraEmbed = (url: string, data: ScrapedInaraData[], title: string) => {
  const embed = createEmbed({
    title,
    description: `${hyperlink('INARA', url)}\n${DIVIDER}`,
  })

  data.forEach(({ type, station, system, distanceLs, distanceLy }) => {
    embed.addFields([
      {
        name: `${type ? `${type} - ` : ''}${system}`,
        value: `${station} - ${distanceLs}\n\`${distanceLy}\`\n`,
      },
    ])
  })
  return embed
}

export const parseInaraRanks = (ranks: InaraProfile['commanderRanksPilot']) =>
  ranks.map(({ rankName, rankValue, rankProgress }) => {
    const rank = Ranks[rankName]
    return {
      name: (RankNames[rankName] || rankName) as string,
      value: `${get(rank, rankValue, '---')} (${Math.floor(rankProgress * 100)}%)`,
    }
  })

export const getInaraStationType = (node: ChildNode | null) => {
  if (!node) {
    return StationType.Other
  }
  const iconBgPosition = get(node, ['style', 'background-position'], '') as string
  const iconBgPositionX = parseInt(iconBgPosition, 10)

  const iconsMap = new Map<number, StationType>([
    [0, StationType.Other],
    [-13, StationType.Coriolis],
    [-26, StationType.Outpost],
    [-39, StationType.Outpost],
    [-52, StationType.Outpost],
    [-65, StationType.Outpost],
    [-78, StationType.Outpost],
    [-91, StationType.Outpost],
    [-104, StationType.Outpost],
    [-117, StationType.Outpost],
    [-130, StationType.Outpost],
    [-143, StationType.Outpost],
    [-156, StationType.Coriolis],
    [-169, StationType.Coriolis],
    [-182, StationType.SurfacePort],
    [-195, StationType.SurfacePort],
  ])

  return iconsMap.get(iconBgPositionX) ?? StationType.Other
}
