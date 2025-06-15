import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { bold, hyperlink } from 'discord.js'
import got from 'got'
import { round, sortBy } from 'lodash'
import { DataParseError } from '../../classes'
import { DIVIDER, InaraUrl } from '../../constants'
import { createEmbed, usePagination } from '../../embeds'
import L from '../../i18n/i18n-node'
import type { FactionSystemsResponse } from '../../types/eliteBGS'
import { getTickTimeInTimezone } from '../../utils'
import { getPastTimeDifferenceFromNow, isAfterTime } from '../../utils/time'
import type { FactionCommandHandler } from './types'

const parseSystemsData = ({
  resposne,
  commandContext: { locale, timezone },
}: {
  resposne: FactionSystemsResponse
  commandContext: Parameters<FactionCommandHandler>[0]['context']
}) => {
  if (!resposne.docs.length) {
    throw new DataParseError({ locale })
  }
  const { faction_presence: factionPresence } = resposne.docs[0]

  const parsedSystemData = factionPresence.map((systemFactionPresence) => ({
    systemName: systemFactionPresence.system_name,
    lastUpdate: dayjs(systemFactionPresence.updated_at).tz(timezone),
    currentInfluence: round(systemFactionPresence.influence * 100, 1),
    isInConflict: systemFactionPresence.conflicts.length > 0,
  }))
  return sortBy(parsedSystemData, 'currentInfluence').reverse()
}

const createFactionSystemsEmbeds = (
  {
    factionSystems,
    tickTime,
  }: {
    factionSystems: ReturnType<typeof parseSystemsData>
    tickTime: Dayjs
  },
  { faction, guildFaction, locale }: Parameters<FactionCommandHandler>[0]['context']
) => {
  const computedDescription = factionSystems.map(
    ({ systemName, currentInfluence, lastUpdate, isInConflict }, index) => {
      const systemInaraUrl = `https://inara.cz/starsystem/?search=${encodeURIComponent(systemName)}`
      const lines = [
        `${index}. ${bold(`${currentInfluence}% - ${hyperlink(systemName, systemInaraUrl)}`)}`,
        `${isInConflict ? `${L[locale].faction.systems.inConflict()}` : ''}`,
        `> ${isAfterTime({ target: lastUpdate, isAfter: tickTime }) ? '✅' : '❌'} ${getPastTimeDifferenceFromNow(
          {
            pastTime: lastUpdate,
          }
        )}`,
      ]
      return lines.filter(Boolean).join('\n')
    }
  )

  // Split computedDescription into chunks of 3800 characters
  const computedDescriptionChunks = []
  let currentChunk = ''
  for (const line of computedDescription) {
    if (currentChunk.length + line.length > 3800) {
      computedDescriptionChunks.push(currentChunk)
      currentChunk = ''
    }
    currentChunk += `${line}\n\n`
  }
  computedDescriptionChunks.push(currentChunk) // Push last chunk

  return computedDescriptionChunks.map((computedDescriptionChunk) =>
    createEmbed({
      title: L[locale].faction.systems.title({
        factionName: guildFaction.shortName,
      }),
      description: `${hyperlink('INARA', InaraUrl.minorFaction(faction.name))}\n${DIVIDER}\n${computedDescriptionChunk}`,
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
    resposne: fetchedData,
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
