import type { Faction, Guild, GuildFaction } from '@prisma/client'
import type { Client } from 'discord.js'
import got from 'got'
import { orderBy, round, uniqBy } from 'lodash'
import { InaraUrl } from '../../../../constants'
import { createEmbed } from '../../../../embeds'
import L from '../../../../i18n/i18n-node'
import type { Locales } from '../../../../i18n/i18n-types'
import type { FactionSystemsResponse } from '../../../../types/eliteBGS'
import logger from '../../../../utils/logger'
import type { DiscordNotificationJobData } from '../types'
import { getNotificationChannelFromGuildFactionOrThrow } from '../utils'

type PossibleExpansionOrigin = {
  systemName: string
  influence: number
}

const getPossibleExpansionOrigins = async ({
  faction,
}: {
  faction: Faction
}): Promise<PossibleExpansionOrigin[]> => {
  const url = `https://elitebgs.app/api/ebgs/v5/factions?id=${faction.ebgsId}`
  const response = await got(url).json<FactionSystemsResponse>()

  if (response.docs.length === 0 || response.docs?.[0]?.faction_presence.length === 0) {
    return []
  }

  const systemsWithGt70Inf = response.docs[0].faction_presence.filter(
    ({ influence }) => influence > 0.7 && influence !== 1 // Ignore systems with 100% influence
  )
  return systemsWithGt70Inf.map(({ system_name, influence }) => ({
    systemName: system_name,
    influence,
  }))
}

const generateEmbed = async ({
  systemName,
  currentSystemInfluence,
  faction,
  locale,
  event,
}: {
  systemName: string
  currentSystemInfluence: number
  faction: Faction
  locale: Locales
  event: DiscordNotificationJobData<
    'expansionPending' | 'expansionStarted' | 'expansionEnded'
  >['event']
}) => {
  const inaraUrl = InaraUrl.minorFaction(faction.name)
  if (event.type === 'expansionPending') {
    const embed = createEmbed({
      title: L[locale].discordNotification.expansion.title.pending(),
      description: L[locale].discordNotification.expansion.description.pending({
        systemName,
        inaraUrl,
      }),
    }).setTimestamp()

    const isCurrentSystemPossibleExpansionOrigin = currentSystemInfluence >= 0.75
    let possibleExpansionOrigins: PossibleExpansionOrigin[] = []

    try {
      possibleExpansionOrigins = await getPossibleExpansionOrigins({ faction })
    } catch (error) {
      logger.error(error, 'Error getting possible expansion origins')
    }

    if (isCurrentSystemPossibleExpansionOrigin) {
      possibleExpansionOrigins = [
        ...possibleExpansionOrigins,
        { systemName, influence: currentSystemInfluence },
      ]
    }

    const uniqueSortedPossibleExpansionOrigins = uniqBy(
      orderBy(possibleExpansionOrigins, 'influence', 'desc'),
      'systemName'
    )

    if (uniqueSortedPossibleExpansionOrigins.length > 0) {
      embed.addFields({
        name: L[locale].discordNotification.expansion.fields.possibleOrigins.title(),
        value: uniqueSortedPossibleExpansionOrigins
          .map(
            (expansionOrigin) =>
              `- ${round(expansionOrigin.influence * 100, 1)}% ${expansionOrigin.systemName}`
          )
          .join('\n'),
      })
    }

    return embed
  }

  if (event.type === 'expansionStarted') {
    return createEmbed({
      title: L[locale].discordNotification.expansion.title.active(),
      description: L[locale].discordNotification.expansion.description.active({
        systemName,
        inaraUrl,
      }),
    }).setTimestamp()
  }

  return createEmbed({
    title: L[locale].discordNotification.expansion.title.ended(),
    description: L[locale].discordNotification.expansion.description.ended({
      inaraUrl,
    }),
  }).setTimestamp()
}

export const processExpansionEvent = async ({
  client,
  jobData,
  guildFactions,
}: {
  client: Client
  jobData: DiscordNotificationJobData<'expansionPending' | 'expansionStarted' | 'expansionEnded'>
  guildFactions: (GuildFaction & { guild: Guild; faction: Faction })[]
}) => {
  const { systemName, event, factionInfluence } = jobData

  await Promise.allSettled(
    guildFactions.map(async (guildFaction) => {
      const channel = getNotificationChannelFromGuildFactionOrThrow({
        client,
        guildFaction,
      })

      const embed = await generateEmbed({
        systemName,
        currentSystemInfluence: factionInfluence,
        faction: guildFaction.faction,
        locale: guildFaction.guild.language as Locales,
        event,
      })

      await channel.send({
        embeds: [embed],
      })
    })
  )
}
