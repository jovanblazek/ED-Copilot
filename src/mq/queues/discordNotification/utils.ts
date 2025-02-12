import { GuildFaction } from '@prisma/client'
import { DiscordNotificationQueue } from '.'
import { EDDNFaction } from '../../../types/eddn'
import { TrackedFaction } from '../../../types/redis'
import { EventTypeMap } from './types'
import { ChannelType, Client } from 'discord.js'

export const DISCORD_NOTIFICATION_JOB_NAME = 'discord-notification'

export const addNotificationToQueue = async <T extends keyof EventTypeMap>({
  systemName,
  trackedFaction,
  eddnFaction,
  timestamp,
  event,
}: {
  systemName: string
  trackedFaction: TrackedFaction
  eddnFaction: EDDNFaction
  timestamp: string
  event: {
    type: T
    data: EventTypeMap[T]
  }
}) => {
  return DiscordNotificationQueue.add(
    `${DISCORD_NOTIFICATION_JOB_NAME}:${systemName}:${trackedFaction.name}:${event.type}`,
    {
      systemName,
      factionName: trackedFaction.name,
      factionInfluence: eddnFaction.Influence,
      timestamp,
      event,
    }
  )
}

export const getNotificationChannelFromGuildFactionOrThrow = async ({
  client,
  guildFaction,
}: {
  client: Client
  guildFaction: GuildFaction
}) => {
  const { notificationChannelId } = guildFaction
  if (!notificationChannelId) {
    throw new Error('Guild faction has no notification channel set')
  }

  const channel = client.channels.cache.get(notificationChannelId)
  if (
    !channel ||
    !(channel.type === ChannelType.GuildAnnouncement || channel.type === ChannelType.GuildText)
  ) {
    throw new Error(`Invalid notification channel, or type: ${channel?.type}`)
  }

  return channel
}
