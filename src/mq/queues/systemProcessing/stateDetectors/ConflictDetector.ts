import {
  getConflictByFactionName,
  isConflictInEDDNStateArray,
  transformConflictToDiscordNotificationData,
} from '../utils'
import { BaseStateDetector } from './BaseStateDetector'
import type { StateDetectorConfig } from './types'

export class ConflictDetector extends BaseStateDetector {
  // eslint-disable-next-line class-methods-use-this
  async detect({
    systemName,
    trackedFaction,
    factionFromEvent,
    timestamp,
    stateChanges,
    conflicts,
  }: StateDetectorConfig) {
    const conflict = getConflictByFactionName(conflicts, trackedFaction.name)
    if (!conflict) {
      return
    }

    const { pendingStatesToStart, activeStatesToStart, recoveringStatesToStart } = stateChanges

    const notificationConfigs = [
      {
        states: pendingStatesToStart,
        type: 'conflictPending' as const,
      },
      {
        states: activeStatesToStart,
        type: 'conflictStarted' as const,
      },
      {
        states: recoveringStatesToStart,
        type: 'conflictEnded' as const,
      },
    ]

    for (const config of notificationConfigs) {
      if (isConflictInEDDNStateArray(config.states)) {
        // eslint-disable-next-line no-await-in-loop
        await this.addNotificationToQueue<typeof config.type>({
          systemName,
          trackedFaction,
          factionFromEvent,
          timestamp,
          type: config.type,
          data: {
            conflict: transformConflictToDiscordNotificationData(conflict),
          },
        })
      }
    }
  }
}
