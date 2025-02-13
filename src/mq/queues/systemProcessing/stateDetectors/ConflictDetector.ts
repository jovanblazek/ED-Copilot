import { addConflictNotificationsToQueue, getConflictByFactionName } from '../utils'
import { BaseStateDetector } from './BaseStateDetector'
import { StateDetectorConfig } from './types'

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
    // Handle conflict notifications
    const conflict = getConflictByFactionName(conflicts, trackedFaction.name)
    if (conflict) {
      await addConflictNotificationsToQueue({
        conflict,
        ...stateChanges,
        systemName,
        trackedFaction,
        factionFromEvent,
        timestamp,
      })
    }
  }
}
