import type { Faction, Guild, GuildFaction } from '@prisma/client'
import type { Client } from 'discord.js'
import { InaraUrl } from '../../../../constants'
import { createEmbed } from '../../../../embeds'
import L from '../../../../i18n/i18n-node'
import type { Locales, Translations } from '../../../../i18n/i18n-types'
import { EDDNConflictStatus, EDDNWarType } from '../../../../types/eddn'
import type { Conflict, DiscordNotificationJobData } from '../types'
import { getNotificationChannelFromGuildFactionOrThrow } from '../utils'

const ConflictTypeTranslationMap: Record<
  EDDNWarType,
  keyof Translations['discordNotification']['conflict']['title']
> = {
  [EDDNWarType.Election]: 'election',
  [EDDNWarType.CivilWar]: 'civilWar',
  [EDDNWarType.War]: 'war',
} as const

const ConflictStatusTranslationMap: Record<
  EDDNConflictStatus,
  keyof Translations['discordNotification']['conflict']['title']['war']
> = {
  [EDDNConflictStatus.Pending]: 'pending',
  [EDDNConflictStatus.Active]: 'active',
  [EDDNConflictStatus.Ended]: 'ended',
} as const

const getEmbedTitle = ({
  systemName,
  conflict,
  locale,
}: {
  systemName: string
  conflict: Conflict
  locale: Locales
}) => {
  const { status, conflictType } = conflict
  const emoji = status === EDDNConflictStatus.Ended ? '🕊️' : '🚨'
  const conflictTypeKey = ConflictTypeTranslationMap[conflictType]
  const statusKey = ConflictStatusTranslationMap[status]

  return L[locale].discordNotification.conflict.title[conflictTypeKey][statusKey]({
    emoji,
    systemName,
  })
}

const generateEmbed = ({
  systemName,
  factionName,
  conflict,
  locale,
}: {
  systemName: string
  factionName: string
  conflict: Conflict
  locale: Locales
}) => {
  const { faction1, faction2 } = conflict
  const trackedFaction = faction1.name === factionName ? faction1 : faction2
  const opponent = faction1.name === factionName ? faction2 : faction1

  return createEmbed({
    title: getEmbedTitle({ systemName, conflict, locale }),
    // description: `PING`, // TODO ping desired role
  })
    .setURL(InaraUrl.minorFaction(factionName))
    .addFields(
      {
        name: L[locale].discordNotification.conflict.fields.status.title(),
        value: `**${trackedFaction.wonDays} : ${opponent.wonDays}**`,
        inline: true,
      },
      {
        name: L[locale].discordNotification.conflict.fields.oponent.title(),
        value: `[${opponent.name}](${InaraUrl.minorFaction(opponent.name)})`,
        inline: true,
      },
      {
        name: L[locale].discordNotification.conflict.fields.opponentStake.title(),
        value: opponent.stake,
        inline: false,
      },
      {
        name: L[locale].discordNotification.conflict.fields.yourStake.title(),
        value: trackedFaction.stake,
        inline: false,
      },
      {
        name: ' ',
        value: `[INARA](${InaraUrl.minorFaction(factionName)})`,
        inline: false,
      }
    )
    .setTimestamp()
}

export const processConflictEvent = async ({
  client,
  jobData,
  guildFactions,
}: {
  client: Client
  jobData: DiscordNotificationJobData<'conflictPending' | 'conflictStarted' | 'conflictEnded'>
  guildFactions: (GuildFaction & { guild: Guild; faction: Faction })[]
}) => {
  const {
    systemName,
    factionName,
    event: {
      data: { conflict },
    },
  } = jobData

  const messagePromises = guildFactions.map((guildFaction) => {
    const channel = getNotificationChannelFromGuildFactionOrThrow({
      client,
      guildFaction,
    })

    return channel.send({
      embeds: [
        generateEmbed({
          systemName,
          factionName,
          conflict,
          locale: guildFaction.guild.language as Locales,
        }),
      ],
    })
  })

  await Promise.allSettled(messagePromises)
}
