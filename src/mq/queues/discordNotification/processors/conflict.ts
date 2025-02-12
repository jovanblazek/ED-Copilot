import { Client } from 'discord.js'
import { InaraUrl } from '../../../../constants'
import { createEmbed } from '../../../../embeds'
import { DiscordNotificationJobData, Conflict } from '../types'
import { EDDNWarType, EDDNConflictStatus } from '../../../../types/eddn'
import { Locales, Translations } from '../../../../i18n/i18n-types'
import L from '../../../../i18n/i18n-node'
import { Faction, Guild, GuildFaction } from '@prisma/client'
import { getNotificationChannelFromGuildFactionOrThrow } from '../utils'

const CONFLICT_TYPE_TRANSLATION_MAP: Record<
  EDDNWarType,
  keyof Translations['discordNotification']['conflict']['conflictType']
> = {
  [EDDNWarType.Election]: 'election',
  [EDDNWarType.CivilWar]: 'civilWar',
  [EDDNWarType.War]: 'war',
}

const CONFLICT_STATUS_TRANSLATION_MAP: Record<
  EDDNConflictStatus,
  keyof Translations['discordNotification']['conflict']['status']
> = {
  [EDDNConflictStatus.Pending]: 'pending',
  [EDDNConflictStatus.Active]: 'active',
  [EDDNConflictStatus.Ended]: 'ended',
}

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

  return L[locale].discordNotification.conflict.title({
    emoji,
    conflictType: CONFLICT_TYPE_TRANSLATION_MAP[conflictType],
    status: CONFLICT_STATUS_TRANSLATION_MAP[status],
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
        name: L[locale].discordNotification.conflict.fields.yourStake.title(),
        value: opponent.stake,
        inline: false,
      },
      {
        name: L[locale].discordNotification.conflict.fields.opponentStake.title(),
        value: faction1.stake,
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

  const messagePromises = guildFactions.map(async (guildFaction) => {
    const channel = await getNotificationChannelFromGuildFactionOrThrow({
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
