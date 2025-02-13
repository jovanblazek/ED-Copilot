import { EDDNState } from '../../../../types/eddn'
import { BaseStateDetector } from './BaseStateDetector'
import type { StateDetectorConfig } from './types'

export class RetreatDetector extends BaseStateDetector {
  // eslint-disable-next-line class-methods-use-this
  async detect({
    systemName,
    trackedFaction,
    factionFromEvent,
    timestamp,
    stateChanges,
  }: StateDetectorConfig) {
    const isRetreatPending = stateChanges.pendingStatesToStart.some(
      (s) => s.State === EDDNState.Retreat
    )
    const isRetreatActive = stateChanges.activeStatesToStart.some(
      (s) => s.State === EDDNState.Retreat
    )
    const isRetreatEnding = stateChanges.statesToEnd.some(
      (s) => s.stateName === EDDNState.Retreat.toString()
    )

    // eslint-disable-next-line no-nested-ternary
    const retreatEventType = isRetreatPending
      ? 'retreatPending'
      : // eslint-disable-next-line no-nested-ternary
        isRetreatActive
        ? 'retreatStarted'
        : // eslint-disable-next-line no-nested-ternary
          isRetreatEnding
          ? 'retreatEnded'
          : undefined

    if (retreatEventType) {
      await this.addNotificationToQueue({
        systemName,
        trackedFaction,
        factionFromEvent,
        timestamp,
        type: retreatEventType,
        data: {},
      })
    }
  }
}
