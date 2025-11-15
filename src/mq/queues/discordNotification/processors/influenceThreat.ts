import type { Client } from 'discord.js'
import { round } from 'lodash'
import { InaraUrl } from '../../../../constants'
import { createEmbed } from '../../../../embeds'
import L from '../../../../i18n/i18n-node'
import type { Locales } from '../../../../i18n/i18n-types'
import type { DiscordNotificationJobData, GuildFactionWithFactionAndGuild } from '../types'
import { getNotificationChannelFromGuildFactionOrThrow } from '../utils'

export const processInfluenceThreatEvent = async ({
  client,
  jobData,
  guildFactions,
}: {
  client: Client
  jobData: DiscordNotificationJobData<'influenceThreat'>
  guildFactions: GuildFactionWithFactionAndGuild[]
}) => {
  const {
    systemName,
    factionName,
    factionInfluence,
    event: {
      data: { threateningFaction, influenceDiff },
    },
  } = jobData

  await Promise.allSettled(
    guildFactions.map(async (guildFaction) => {
      const channel = getNotificationChannelFromGuildFactionOrThrow({
        client,
        guildFaction,
      })

      const locale = guildFaction.guild.language as Locales

      const embed = createEmbed({
        title: L[locale].discordNotification.influenceThreat.title({
          systemName,
        }),
        description: L[locale].discordNotification.influenceThreat.description({
          factionName,
          factionInfluence: `${round(factionInfluence * 100, 1)}%`,
          threateningFaction: threateningFaction.name,
          threateningFactionInfluence: `${round(threateningFaction.influence * 100, 1)}%`,
          influenceDiff: `${round(influenceDiff, 1)}%`,
          inaraUrl: InaraUrl.minorFaction(factionName),
        }),
      }).setTimestamp()

      await channel.send({
        embeds: [embed],
      })
    })
  )
}
