import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { bold, hyperlink } from 'discord.js'
import got from 'got'
import { round, sortBy } from 'lodash'
import { DataParseError } from '../../classes'
import { DIVIDER, InaraUrl } from '../../constants'
import { createEmbed, usePagination } from '../../embeds'
import { chunkDescription } from '../../embeds/utils'
import L from '../../i18n/i18n-node'
import type { Locales } from '../../i18n/i18n-types'
import type { FactionSystemsResponse } from '../../types/eliteBGS'
import { getTickTimeInTimezone } from '../../utils'
import { getPastTimeDifferenceFromNow, isAfterTime } from '../../utils/time'
import type { FactionCommandHandler } from './types'

const INFLUENCE_DECIMAL_PLACES = 1

interface ParsedSystemData {
  systemName: string
  lastUpdate: Dayjs
  currentInfluence: number
  isInConflict: boolean
}

const parseSystemsData = ({
  response,
  commandContext: { locale, timezone },
}: {
  response: FactionSystemsResponse
  commandContext: Parameters<FactionCommandHandler>[0]['context']
}): ParsedSystemData[] => {
  if (!response.docs.length) {
    throw new DataParseError({ locale })
  }

  const { faction_presence: factionPresence } = response.docs[0]

  const parsedSystemData: ParsedSystemData[] = factionPresence.map((systemFactionPresence) => ({
    systemName: systemFactionPresence.system_name,
    lastUpdate: dayjs(systemFactionPresence.updated_at).tz(timezone),
    currentInfluence: round(systemFactionPresence.influence * 100, INFLUENCE_DECIMAL_PLACES),
    isInConflict: systemFactionPresence.conflicts.length > 0,
  }))

  return sortBy(parsedSystemData, 'currentInfluence').reverse()
}

const formatSystemEntry = (
  { systemName, currentInfluence, lastUpdate, isInConflict }: ParsedSystemData,
  index: number,
  tickTime: Dayjs,
  locale: Locales
): string => {
  const systemInaraUrl = `https://inara.cz/starsystem/?search=${encodeURIComponent(systemName)}`
  const isUpdateRecent = isAfterTime({ target: lastUpdate, isAfter: tickTime })
  const updateStatus = isUpdateRecent ? '✅' : '❌'
  const timeDifference = getPastTimeDifferenceFromNow({ pastTime: lastUpdate })

  const lines = [
    `${index + 1}. ${bold(`${currentInfluence}% - ${hyperlink(systemName, systemInaraUrl)}`)}`,
    isInConflict ? L[locale].faction.systems.inConflict() : '',
    `> ${updateStatus} ${timeDifference}`,
  ]

  return lines.filter(Boolean).join('\n')
}

const createFactionSystemsEmbeds = (
  {
    factionSystems,
    tickTime,
  }: {
    factionSystems: ParsedSystemData[]
    tickTime: Dayjs
  },
  { faction, guildFaction, locale }: Parameters<FactionCommandHandler>[0]['context']
) => {
  const systemEntries = factionSystems.map((system, index) =>
    formatSystemEntry(system, index, tickTime, locale)
  )

  const descriptionChunks = chunkDescription(systemEntries)

  return descriptionChunks.map((chunk) =>
    createEmbed({
      title: L[locale].faction.systems.title({
        factionName: guildFaction.shortName,
      }),
      description: `${hyperlink('INARA', InaraUrl.minorFaction(faction.name))}\n${DIVIDER}\n${chunk}`,
    })
  )
}

export const factionSystemsHandler: FactionCommandHandler = async ({
  interaction,
  context: { faction, guildFaction, locale, timezone },
}) => {
  const url = `https://elitebgs.app/api/ebgs/v5/factions?eddbId=${faction.eddbId}`
  const fetchedData = await got(url).json<FactionSystemsResponse>()

  const factionSystems = parseSystemsData({
    response: fetchedData,
    commandContext: {
      locale,
      faction,
      timezone,
      guildFaction,
    },
  })
  if (!factionSystems.length) {
    throw new DataParseError({ locale })
  }
  const tickTime = await getTickTimeInTimezone({ locale, timezone })

  const embeds = createFactionSystemsEmbeds(
    {
      factionSystems,
      tickTime,
    },
    { locale, faction, guildFaction, timezone }
  )

  await usePagination({
    interaction,
    embeds,
    locale,
  })
}
