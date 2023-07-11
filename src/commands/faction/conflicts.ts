import { Faction } from '@prisma/client'
import dayjs, { Dayjs } from 'dayjs'
import { bold, EmbedBuilder, inlineCode } from 'discord.js'
import got from 'got'
import { DataParseError } from '../../classes'
import { DIVIDER, Emojis, InaraUrl } from '../../constants'
import { createEmbed } from '../../embeds'
import L from '../../i18n/i18n-node'
import { Locales } from '../../i18n/i18n-types'
import type { FactionConflicsResponse } from '../../types/eliteBGS'
import { getTickTime, wasAfterTick } from '../../utils'
import type { FactionCommandHandler } from './types'

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
  locale,
  faction,
}: {
  resposne: FactionConflicsResponse
  locale: Locales
  faction: Faction
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

// TODO tidy up this arguments mess
const printConflict = ({
  embed,
  conflict,
  targetFaction,
  enemyFaction,
  tickTime,
  timezone,
  locale,
  faction,
}: {
  embed: EmbedBuilder
  conflict: Conflict
  targetFaction: FactionInConflict
  enemyFaction: FactionInConflict
  tickTime: Dayjs
  timezone: string
  locale: Locales
  faction: Faction
}) => {
  embed.addFields([
    {
      name: `${bold(`${faction.shortName} vs ${enemyFaction.name}`)}`,
      value: `${Emojis.system} ${conflict.system}`,
    },
    ...(conflict.status === 'pending'
      ? [
          {
            name: inlineCode(L[locale].faction.conflicts.pendingConflict()),
            value: '\u200b',
            inline: true,
          },
        ]
      : []),
    {
      name: inlineCode(`${targetFaction.daysWon} vs ${enemyFaction.daysWon}`),
      value: '\u200b',
      inline: true,
    },
    {
      name: `🏆 ${enemyFaction.stake || ' ---'}`,
      value: `💥 ${targetFaction.stake || ' ---'}`,
      inline: true,
    },
    {
      name: '\u200b',
      value: `${conflict.lastUpdate.tz(timezone).format('DD.MM.YYYY HH:mm')} ${
        wasAfterTick({
          lastUpdate: conflict.lastUpdate,
          tickTime,
        })
          ? `✅`
          : `❌`
      }`,
    },
  ])
}

export const factionConflictsHandler: FactionCommandHandler = async ({
  interaction,
  context: { locale, faction, timezone },
}) => {
  const conflictsUrl = `https://elitebgs.app/api/ebgs/v5/factions?eddbId=${faction.eddbId}&systemDetails=true`
  const fetchedData = await got(conflictsUrl).json<FactionConflicsResponse>()
  const conflicts = parseConflictsData({
    resposne: fetchedData,
    locale,
    faction,
  })
  const tickTime = await getTickTime({ locale, timezone })
  const embed = createEmbed({
    title: L[locale].faction.conflicts.title({
      factionName: faction.shortName,
    }),
    description: `[INARA](${InaraUrl.minorFaction(faction.name)})\n${DIVIDER}`,
  })

  if (!conflicts.length) {
    embed.addFields([
      {
        name: L[locale].faction.conflicts.noConflicts(),
        value: '\u200b',
      },
    ])
  } else {
    conflicts.forEach((conflict) => {
      if (conflict.faction1.isTargetFaction) {
        printConflict({
          embed,
          conflict,
          targetFaction: conflict.faction1,
          enemyFaction: conflict.faction2,
          tickTime,
          timezone,
          locale,
          faction,
        })
      } else {
        printConflict({
          embed,
          conflict,
          targetFaction: conflict.faction2,
          enemyFaction: conflict.faction1,
          tickTime,
          timezone,
          locale,
          faction,
        })
      }
    })
  }

  await interaction.editReply({
    embeds: [embed],
  })
}
