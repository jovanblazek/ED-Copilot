import dayjs from 'dayjs'
import { blockQuote } from 'discord.js'
import got from 'got'
import { groupBy, map, round, sortBy } from 'lodash'
import { DataParseError } from '../../classes'
import { DIVIDER, Emojis, InaraUrl } from '../../constants'
import { createEmbed } from '../../embeds'
import L from '../../i18n/i18n-node'
import type { FactionSystemsResponse } from '../../types/eliteBGS'
import { getTickTime } from '../../utils'
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
  const { history } = resposne.docs[0]
  const historyGroupedBySystem = groupBy(history, 'system_id')
  const parsedSystemData = map(historyGroupedBySystem, (systemHistory) => {
    // sort in ascending order, older first
    const sortedHistory = sortBy(systemHistory, 'updated_at')
    const currentValues = sortedHistory[1]
    const previousValues = sortedHistory[0]
    return {
      systemName: currentValues.system,
      lastUpdate: dayjs(currentValues.updated_at).tz(timezone),
      currentInfluence: round(currentValues.influence * 100, 1),
      influenceTrend: round((currentValues.influence - previousValues.influence) * 100, 1),
    }
  })
  return sortBy(parsedSystemData, 'currentInfluence').reverse()
}

export const factionSystemsHandler: FactionCommandHandler = async ({
  interaction,
  context: { faction, locale, timezone },
}) => {
  const url = `https://elitebgs.app/api/ebgs/v5/factions?eddbId=${faction.eddbId}&count=2`
  const fetchedData = await got(url).json<FactionSystemsResponse>()

  const factionSystems = parseSystemsData({
    resposne: fetchedData,
    commandContext: {
      locale,
      faction,
      timezone,
    },
  })
  if (!factionSystems.length) {
    throw new DataParseError({ locale })
  }
  const tickTime = await getTickTime({ locale, timezone })
  const embed = createEmbed({
    title: L[locale].faction.systems.title({
      factionName: faction.shortName,
    }),
    description: `[INARA](${InaraUrl.minorFaction(faction.name)})\n${DIVIDER}`,
  })

  embed.addFields(
    factionSystems.map(({ systemName, currentInfluence, influenceTrend, lastUpdate }) => ({
      name: `${currentInfluence}% - ${systemName}`,
      value: `${blockQuote(
        `${
          influenceTrend > 0 ? `${Emojis.green_upwards_arrow} +` : `${Emojis.red_downwards_arrow} `
        }${influenceTrend}%\n${
          isAfterTime({ target: lastUpdate, isAfter: tickTime }) ? '✅' : '❌'
        } ${getPastTimeDifferenceFromNow({
          pastTime: lastUpdate,
        })}`
      )}`,
    }))
  )

  await interaction.editReply({ embeds: [embed] })
}
