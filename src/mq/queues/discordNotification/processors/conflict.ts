import { ChannelType, Client } from 'discord.js'
import { InaraUrl } from '../../../../constants'
import { createEmbed } from '../../../../embeds'
import { Prisma } from '../../../../utils'
import { DiscordNotificationJobData, Conflict } from '../types'

const CONFLICT_TYPE_MAP = {
  election: 'Election',
  civilwar: 'Civil War',
  war: 'War',
}

const CONFLICT_STATUS_MAP = {
  pending: 'Pending',
  active: 'Active',
  ended: 'Ended',
}

const getEmbedTitle = ({ systemName, conflict }: { systemName: string; conflict: Conflict }) => {
  const { status, conflictType } = conflict
  const emoji = status === 'ended' ? '🕊️' : '🚨'

  return `${emoji} ${CONFLICT_TYPE_MAP[conflictType]} ${CONFLICT_STATUS_MAP[status]} in ${systemName} ${emoji}`
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
    event: { data: { conflict } },
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

  const { faction1, faction2 } = conflict
  const trackedFaction = faction1.name === factionName ? faction1 : faction2
  const opponent = faction1.name === factionName ? faction2 : faction1

  // TODO: translations
  const embed = createEmbed({
    title: getEmbedTitle({ systemName, conflict }),
    description: `PING`,
  })
    .setURL(InaraUrl.minorFaction(factionName))
    .addFields(
      {
        name: 'Status',
        value: `**${trackedFaction.wonDays} : ${opponent.wonDays}**`,
        inline: true,
      },
      {
        name: 'Oponent:',
        value: `[${opponent.name}](${InaraUrl.minorFaction(opponent.name)})`,
        inline: true,
      },
      {
        name: '🏆 Gained on Victory',
        value: opponent.stake,
        inline: false,
      },
      {
        name: '💥 Lost on Defeat',
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

  const messagePromises = guildFactions.map(async (guildFaction) => {
    const { notificationChannelId } = guildFaction
    if (!notificationChannelId) {
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
      embeds: [embed],
    })
  })

  await Promise.allSettled(messagePromises)
}
