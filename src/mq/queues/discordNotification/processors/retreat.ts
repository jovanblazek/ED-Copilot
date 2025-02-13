import { Faction, Guild, GuildFaction } from '@prisma/client'
import { Client } from 'discord.js'
import { round } from 'lodash'
import { InaraUrl } from '../../../../constants'
import { createEmbed } from '../../../../embeds'
import L from '../../../../i18n/i18n-node'
import { Locales, Translations } from '../../../../i18n/i18n-types'
import { DiscordNotificationJobData } from '../types'
import { getNotificationChannelFromGuildFactionOrThrow } from '../utils'

const RetreatStatusTranslationMap: Record<
  'retreatPending' | 'retreatStarted' | 'retreatEnded',
  keyof Translations['discordNotification']['retreat']['title']
> = {
  retreatPending: 'pending',
  retreatStarted: 'active',
  retreatEnded: 'ended',
} as const

const generateEmbed = ({
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
  event: DiscordNotificationJobData<'retreatPending' | 'retreatStarted' | 'retreatEnded'>['event']
}) => {
  const inaraUrl = InaraUrl.minorFaction(faction.name)
  const statusKey = RetreatStatusTranslationMap[event.type]

  return createEmbed({
    title: L[locale].discordNotification.retreat.title[statusKey](),
    description: L[locale].discordNotification.retreat.description[statusKey]({
      systemName,
      inaraUrl,
      influence: `${round(currentSystemInfluence * 100, 1)}%`,
    }),
  }).setTimestamp()
}

export const processRetreatEvent = async ({
  client,
  jobData,
  guildFactions,
}: {
  client: Client
  jobData: DiscordNotificationJobData<'retreatPending' | 'retreatStarted' | 'retreatEnded'>
  guildFactions: (GuildFaction & { guild: Guild; faction: Faction })[]
}) => {
  const { systemName, event, factionInfluence } = jobData

  await Promise.allSettled(
    guildFactions.map(async (guildFaction) => {
      const channel = getNotificationChannelFromGuildFactionOrThrow({
        client,
        guildFaction,
      })

      const embed = generateEmbed({
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
