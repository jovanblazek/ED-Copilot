import dayjs, { Dayjs } from 'dayjs'
import { hyperlink, inlineCode, quote } from 'discord.js'
import got from 'got'
import { chunk } from 'lodash'
import { DataParseError } from '../../classes'
import { DIVIDER, Emojis, InaraUrl } from '../../constants'
import { createEmbed, usePagination } from '../../embeds'
import L from '../../i18n/i18n-node'
import type { FactionConflicsResponse } from '../../types/eliteBGS'
import { getTickTimeInTimezone } from '../../utils'
import { getPastTimeDifferenceFromNow, isAfterTime } from '../../utils/time'
import type { FactionCommandHandler } from './types'

const CONFLICTS_PER_EMBED = 6 // 4 fields per conflict = 25/4

type FactionInConflict = {
  name: string
  stake: string
  daysWon: number
  isTargetFaction: boolean
}

type Conflict = {
  system: string
  lastUpdate: Dayjs
  status: string
  faction1: FactionInConflict
  faction2: FactionInConflict
}

const parseConflictsData = ({
  resposne,
  commandContext: { faction, locale },
}: {
  resposne: FactionConflicsResponse
  commandContext: Parameters<FactionCommandHandler>[0]['context']
}): Conflict[] => {
  if (!resposne.docs.length) {
    throw new DataParseError({ locale })
  }
  const systemsPresent = resposne.docs[0].faction_presence
  const targetFactionId = faction.ebgsId
  return systemsPresent.reduce(
    (
      acc,
      {
        conflicts: factionConflicts,
        system_details: systemDetails,
        system_name: systemName,
        updated_at: updatedAt,
      }
    ) => {
      // if selected faction is not in conflict, skip
      if (!factionConflicts.length) {
        return acc
      }

      // find conflict with selected faction, there may be multiple conflicts in single system
      const conflict = systemDetails.conflicts.find(
        ({ faction1, faction2 }) =>
          faction1.faction_id === targetFactionId || faction2.faction_id === targetFactionId
      )

      if (!conflict) {
        return acc
      }

      return [
        ...acc,
        {
          system: systemName,
          lastUpdate: dayjs(updatedAt).utc(),
          status: conflict.status,
          faction1: {
            name: conflict.faction1.name,
            stake: conflict.faction1.stake,
            daysWon: conflict.faction1.days_won,
            isTargetFaction: conflict.faction1.faction_id === targetFactionId,
          },
          faction2: {
            name: conflict.faction2.name,
            stake: conflict.faction2.stake,
            daysWon: conflict.faction2.days_won,
            isTargetFaction: conflict.faction2.faction_id === targetFactionId,
          },
        },
      ]
    },
    []
  )
}

const printConflict = ({
  tickTime,
  isLastConflict,
  conflictData: { conflict, targetFaction, enemyFaction },
  commandContext: { locale, guildFaction },
}: {
  tickTime: Dayjs
  isLastConflict: boolean
  conflictData: {
    conflict: Conflict
    targetFaction: FactionInConflict
    enemyFaction: FactionInConflict
  }
  commandContext: Parameters<FactionCommandHandler>[0]['context']
}) => {
  const isConflictPending = conflict.status === 'pending'
  return [
    {
      name: `${Emojis.system} ${conflict.system}`,
      value: `${quote(
        `${
          isAfterTime({
            target: conflict.lastUpdate,
            isAfter: tickTime,
          })
            ? `✅`
            : `❌`
        } ${getPastTimeDifferenceFromNow({
          pastTime: conflict.lastUpdate,
        })}`
      )}`,
    },
    {
      name: `${inlineCode(targetFaction.daysWon.toString())} - ${guildFaction.shortName}`,
      value: `${inlineCode(enemyFaction.daysWon.toString())} - ${enemyFaction.name}`,
      inline: true,
    },
    {
      name: `🏆 ${enemyFaction.stake || ' ---'}`,
      value: `💥 ${targetFaction.stake || ' ---'}`,
      inline: true,
    },
    ...(!isLastConflict || isConflictPending
      ? [
          {
            name: isConflictPending
              ? inlineCode(L[locale].faction.conflicts.pendingConflict())
              : '\u200b',
            value: !isLastConflict ? DIVIDER : '\u200b',
          },
        ]
      : []),
  ]
}

const createFactionConflictsEmbeds = (
  {
    factionConflicts,
    tickTime,
  }: {
    factionConflicts: Conflict[]
    tickTime: Dayjs
  },
  context: Parameters<FactionCommandHandler>[0]['context']
) => {
  const { faction, guildFaction, locale } = context
  const conflictsLength = factionConflicts.length

  const embedHeader = {
    title: L[locale].faction.conflicts.title({
      factionName: guildFaction.shortName,
    }),
    description: `${hyperlink('INARA', InaraUrl.minorFaction(faction.name))}\n${DIVIDER}${
      !conflictsLength ? `\n${L[locale].faction.conflicts.noConflicts()}` : ''
    }`,
  }

  if (!conflictsLength) {
    return [createEmbed(embedHeader)]
  }

  const factionConflictsChunks = chunk(factionConflicts, CONFLICTS_PER_EMBED)
  return factionConflictsChunks.map((factionConflictsChunk) =>
    createEmbed(embedHeader).addFields(
      factionConflictsChunk.flatMap((conflict, index) => {
        const isLastConflict = index === conflictsLength - 1
        if (conflict.faction1.isTargetFaction) {
          return printConflict({
            tickTime,
            isLastConflict,
            conflictData: {
              conflict,
              targetFaction: conflict.faction1,
              enemyFaction: conflict.faction2,
            },
            commandContext: context,
          })
        }
        return printConflict({
          tickTime,
          isLastConflict,
          conflictData: {
            conflict,
            targetFaction: conflict.faction2,
            enemyFaction: conflict.faction1,
          },
          commandContext: context,
        })
      })
    )
  )
}

export const factionConflictsHandler: FactionCommandHandler = async ({ interaction, context }) => {
  const { faction, timezone, locale } = context
  const conflictsUrl = `https://elitebgs.app/api/ebgs/v5/factions?eddbId=${faction.eddbId}&systemDetails=true`
  const fetchedData = await got(conflictsUrl).json<FactionConflicsResponse>()
  const factionConflicts = parseConflictsData({
    resposne: fetchedData,
    commandContext: context,
  })
  const tickTime = await getTickTimeInTimezone({ locale, timezone })
  const embeds = createFactionConflictsEmbeds(
    {
      factionConflicts,
      tickTime,
    },
    context
  )

  await usePagination({
    interaction,
    embeds,
    locale,
  })
}
