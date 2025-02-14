import { isConflictInEDDNStateArray } from '../utils'
import { BaseStateDetector } from './BaseStateDetector'
import type { StateDetectorConfig } from './types'

export class InfluenceThreatDetector extends BaseStateDetector {
  async detect({
    systemName,
    trackedFaction,
    factionFromEvent,
    timestamp,
    factions,
  }: StateDetectorConfig) {
    // Get all factions sorted by influence
    const sortedFactions = [...factions].sort((a, b) => b.Influence - a.Influence)

    // Check if tracked faction is leading
    if (sortedFactions[0].Name !== factionFromEvent.Name) {
      return
    }

    // Skip if faction is in any type of conflict, or right after a conflict
    if (
      isConflictInEDDNStateArray(factionFromEvent?.PendingStates ?? []) ||
      isConflictInEDDNStateArray(factionFromEvent?.ActiveStates ?? []) ||
      isConflictInEDDNStateArray(factionFromEvent?.RecoveringStates ?? [])
    ) {
      return
    }

    // Check if second faction is within 7 influence points
    const influenceDiff = (sortedFactions[0].Influence - sortedFactions[1].Influence) * 100

    if (influenceDiff <= 7) {
      await this.addNotificationToQueue({
        systemName,
        trackedFaction,
        factionFromEvent,
        timestamp,
        type: 'influenceThreat',
        data: {
          threateningFaction: {
            name: sortedFactions[1].Name,
            influence: sortedFactions[1].Influence,
          },
          influenceDiff,
        },
      })
    }
  }
}
