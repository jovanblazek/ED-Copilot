import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { hyperlink, inlineCode, quote } from 'discord.js'
import { DataParseError } from '../../classes'
import type { StationType } from '../../constants'
import {
  DIVIDER,
  Emojis,
  InaraUrl,
  StationType as InternalStationType,
  StationTypeEmojis,
} from '../../constants'
import { createEmbed, usePagination } from '../../embeds'
import { createEliteHubVaultClient } from '../../graphql/client'
import {
  FactionConflictsDocument,
  type FactionConflictsQuery,
  type StationTypeEnum,
} from '../../graphql/generated/graphql'
import L from '../../i18n/i18n-node'
import { getTickTimeInTimezone } from '../../utils'
import { getPastTimeDifferenceFromNow, isAfterTime } from '../../utils/time'
import type { FactionCommandHandler } from './types'

const CONFLICTS_PER_EMBED = 6 // 4 fields per conflict = 25/4

type FactionInConflict = {
  name: string
  stake: string
  daysWon: number
  isTargetFaction: boolean
  stationType: StationType | null
}

type Conflict = {
  system: string
  lastUpdate: Dayjs
  status: string
  type: string
  faction1: FactionInConflict
  faction2: FactionInConflict
}
const VaultToInternalStationType: Partial<Record<StationTypeEnum, StationType>> = {
  AsteroidBase: InternalStationType.AsteroidStation,
  Coriolis: InternalStationType.Coriolis,
  MegaShip: InternalStationType.Megaship,
  Ocellus: InternalStationType.Ocellus,
  OnFootSettlement: InternalStationType.PlanetarySettlement,
  Orbis: InternalStationType.Orbis,
  Outpost: InternalStationType.Outpost,
  PlanetaryOutpost: InternalStationType.PlanetarySettlement,
  PlanetaryPort: InternalStationType.SurfacePort,
}

export const mapVaultStationType = (stationType: StationTypeEnum | null): StationType | null =>
  stationType ? (VaultToInternalStationType[stationType] ?? null) : null

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
      name: `🏆 ${enemyFaction.stationType ? `${StationTypeEmojis[enemyFaction.stationType]}` : ''} ${enemyFaction.stake || ' ---'}`,
      value: `💥 ${targetFaction.stationType ? `${StationTypeEmojis[targetFaction.stationType]}` : ''} ${targetFaction.stake || ' ---'}`,
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

const createFactionConflictsEmbed = (
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

  const embed = createEmbed({
    title: L[locale].faction.conflicts.title({
      factionName: guildFaction.shortName,
    }),
    description: `${hyperlink('INARA', InaraUrl.minorFaction(faction.name))}\n${DIVIDER}${
      !conflictsLength ? `\n${L[locale].faction.conflicts.noConflicts()}` : ''
    }`,
  })

  if (!conflictsLength) {
    return embed
  }

  embed.addFields(
    factionConflicts.flatMap((conflict, index) => {
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

  return embed
}

const fetchFactionConflictPage = async ({
  factionId,
  after,
}: {
  factionId: string
  after?: string | null
}): Promise<FactionConflictsQuery['factionConflicts']> => {
  const client = createEliteHubVaultClient()
  const response = await client.request(FactionConflictsDocument, {
    factionId,
    first: CONFLICTS_PER_EMBED,
    after: after ?? null,
  })

  return response.factionConflicts
}

const createConflictPage = ({
  factionConflictsConnection,
  tickTime,
  context,
}: {
  factionConflictsConnection: NonNullable<FactionConflictsQuery['factionConflicts']>
  tickTime: Dayjs
  context: Parameters<FactionCommandHandler>[0]['context']
}) => {
  const mappedConflicts = factionConflictsConnection.edges
    .map((edge): Conflict | null => {
      const node = edge?.node

      if (!node?.system?.name || !node.faction?.name || !node.opponentFaction?.name) {
        return null
      }

      return {
        system: node.system.name,
        lastUpdate: dayjs(String(node.updatedAt)).utc(),
        status: node.status.toLowerCase(),
        type: node.type.toLowerCase(),
        faction1: {
          name: node.faction.name,
          stake: node.factionStakeStation?.name ?? '',
          daysWon: node.factionWonDays,
          isTargetFaction: true,
          stationType: mapVaultStationType(node.factionStakeStation?.stationType ?? null),
        },
        faction2: {
          name: node.opponentFaction.name,
          stake: node.opponentStakeStation?.name ?? '',
          daysWon: node.opponentWonDays,
          isTargetFaction: false,
          stationType: mapVaultStationType(node.opponentStakeStation?.stationType ?? null),
        },
      }
    })
    .filter((conflict): conflict is Conflict => Boolean(conflict))

  return {
    embed: createFactionConflictsEmbed(
      {
        factionConflicts: mappedConflicts,
        tickTime,
      },
      context
    ),
    hasNextPage: factionConflictsConnection.pageInfo.hasNextPage,
    nextCursor: factionConflictsConnection.pageInfo.endCursor,
  }
}

export const factionConflictsHandler: FactionCommandHandler = async ({ interaction, context }) => {
  const { faction, timezone, locale } = context

  if (!faction.elitehubVaultId) {
    throw new DataParseError({ locale })
  }

  const [tickTime, factionConflictsConnection] = await Promise.all([
    getTickTimeInTimezone({ locale, timezone }),
    fetchFactionConflictPage({
      factionId: faction.elitehubVaultId,
    }),
  ])

  if (!factionConflictsConnection) {
    throw new DataParseError({ locale })
  }

  const initialPage = createConflictPage({
    factionConflictsConnection,
    tickTime,
    context,
  })

  await usePagination({
    interaction,
    locale,
    initialPage,
    loadPage: async (cursor) => {
      const nextPage = await fetchFactionConflictPage({
        factionId: faction.elitehubVaultId!,
        after: cursor,
      })

      if (!nextPage) {
        throw new DataParseError({ locale })
      }

      return createConflictPage({
        factionConflictsConnection: nextPage,
        tickTime,
        context,
      })
    },
  })
}
