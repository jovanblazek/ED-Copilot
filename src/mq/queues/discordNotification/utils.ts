import type { GuildFaction } from '@prisma/client'
import type { Client } from 'discord.js'
import { ChannelType } from 'discord.js'

export const getNotificationChannelFromGuildFactionOrThrow = ({
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
