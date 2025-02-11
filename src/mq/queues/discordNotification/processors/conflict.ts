import { ChannelType, Client } from 'discord.js'
import { InaraUrl } from '../../../../constants'
import { createEmbed } from '../../../../embeds'
import { Prisma } from '../../../../utils'
import { DiscordNotificationJobData, Conflict } from '../types'
import { EDDNWarType, EDDNConflictStatus } from '../../../../types/eddn'
import { Locales, Translations } from '../../../../i18n/i18n-types'
import L from '../../../../i18n/i18n-node'

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
}: {
  client: Client
  jobData: DiscordNotificationJobData<'conflictPending' | 'conflictStarted' | 'conflictEnded'>
}) => {
  const {
    systemName,
    factionName,
    event: {
      data: { conflict },
    },
  } = jobData

  const guildFactions = await Prisma.guildFaction.findMany({
    where: {
      notificationChannelId: {
        not: null,
      },
      faction: {
        name: factionName,
      },
    },
  })

  if (guildFactions.length === 0) {
    return
  }

  const messagePromises = guildFactions.map(async (guildFaction) => {
    const { notificationChannelId } = guildFaction
    if (!notificationChannelId) {
      return
    }

    const guild = await Prisma.guild.findUnique({
      where: {
        id: guildFaction.guildId,
      },
    })
    if (!guild) {
      return
    }

    const channel = client.channels.cache.get(notificationChannelId)
    if (
      !channel ||
      !(channel.type === ChannelType.GuildAnnouncement || channel.type === ChannelType.GuildText)
    ) {
      return
    }

    return channel.send({
      embeds: [
        generateEmbed({
          systemName,
          factionName,
          conflict,
          locale: guild.language as Locales,
        }),
      ],
    })
  })

  await Promise.allSettled(messagePromises)
}
