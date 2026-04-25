import type { Faction } from '@prisma/client'
import type { Client } from 'discord.js'
import { orderBy, round, uniqBy } from 'lodash'
import { InaraUrl } from '../../../../constants'
import { createEmbed } from '../../../../embeds'
import { createEliteHubVaultClient } from '../../../../graphql/client'
import { PossibleExpansionOriginsDocument } from '../../../../graphql/generated/graphql'
import L from '../../../../i18n/i18n-node'
import type { Locales } from '../../../../i18n/i18n-types'
import logger from '../../../../utils/logger'
import type { DiscordNotificationJobData, GuildFactionWithFactionAndGuild } from '../types'
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
  const client = createEliteHubVaultClient()
  const response = await client.request(PossibleExpansionOriginsDocument, {
    factionId: faction.elitehubVaultId,
  })

  const factionStates = response.factionStates?.nodes ?? []
  const systemsWithGt70Inf = factionStates.filter(
    (
      factionState
    ): factionState is NonNullable<typeof factionState> & {
      system: { name: string }
    } =>
      Boolean(
        factionState?.system?.name && factionState.influence > 0.7 && factionState.influence !== 1 // Ignore systems with 100% influence
      )
  )

  return systemsWithGt70Inf.map((factionState) => ({
    systemName: factionState.system.name,
    influence: factionState.influence,
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
  guildFactions: GuildFactionWithFactionAndGuild[]
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
