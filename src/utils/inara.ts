import got from 'got'
import i18next from 'i18next'
import { JSDOM } from 'jsdom'
import { chunk } from 'lodash'
import { DIVIDER, RankNames, Ranks } from '../constants'
import { createEmbed } from './embed'

type InaraEvent = {
  eventCustomID?: number
  eventName: string
  eventTimestamp?: string
  eventData: unknown | unknown[]
}

export type InaraResponse<T> = {
  header: {
    eventStatus: number
  }
  events: {
    eventCustomID?: number
    eventStatus: number
    eventStatusText?: string
    eventData: T
  }[]
}

export type InaraProfile = {
  userID: number
  userName: string
  commanderName: string
  commanderRanksPilot: {
    rankName: string
    rankValue: number
    rankProgress: number
  }[]
  avatarImageURL?: string
  inaraURL: string
  otherNamesFound: string[]
}

const INARA_API_URL = 'https://inara.cz/inapi/v1/'

// TODO use constants from package.json
const APP_NAME = 'ED-Copilot'
const APP_VERSION = '0.1'

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
    distanceLy: row[cellsPerRow - 1].textContent ?? '',
  }))

  return data
}

export const generateInaraEmbed = (url: string, data: ScrapedInaraData[], title: string) => {
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

export const parseInaraRanks = (ranks: InaraProfile['commanderRanksPilot']) =>
  ranks.map(({ rankName, rankValue, rankProgress }) => {
    const rank: string[] | undefined = Ranks[rankName]
    return {
      name: (RankNames[rankName] || rankName) as string,
      value: `${rank ? rank[rankValue] : 'Error'} (${Math.floor(rankProgress * 100)}%)`,
    }
  })
