import type { EliteHubVaultClient } from '../../../../graphql/client'
import { ThreatDetailsDocument } from '../../../../graphql/generated/graphql'
import type { FactionControlThreatChangedEvent } from '../../../../realtime/types'
import type { DiscordNotificationJobData } from '../../discordNotification/types'

export const processFactionControlThreatChangedEvent = async ({
  client,
  payload,
}: {
  client: EliteHubVaultClient
  payload: FactionControlThreatChangedEvent
}): Promise<DiscordNotificationJobData<'influenceThreat'> | null> => {
  if (payload.status === 'cleared') {
    return null
  }

  const response = await client.request(ThreatDetailsDocument, {
    factionId: payload.factionId,
    challengerFactionId: payload.challengerFactionId,
    systemId: payload.systemId,
  })

  if (!response.controller?.faction?.name || !response.controller.system?.name) {
    throw new Error('Missing controller details for influence threat notification')
  }

  if (!response.challenger?.faction?.name) {
    throw new Error('Missing challenger details for influence threat notification')
  }

  return {
    source: 'sse',
    systemName: response.controller.system.name,
    factionName: response.controller.faction.name,
    factionInfluence: response.controller.influence,
    timestamp: payload.timestamp,
    event: {
      type: 'influenceThreat',
      data: {
        threateningFaction: {
          name: response.challenger.faction.name,
          influence: response.challenger.influence,
        },
        influenceDiff: payload.gap * 100,
      },
    },
  }
}
