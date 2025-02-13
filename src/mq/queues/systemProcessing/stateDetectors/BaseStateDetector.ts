/* eslint-disable class-methods-use-this */
import { EDDNState } from '../../../../types/eddn'
import { DiscordNotificationQueue } from '../../discordNotification'
import { EventTypeMap } from '../../discordNotification/types'
import { DISCORD_NOTIFICATION_JOB_NAME } from '../constants'
import { StateDetector, StateDetectorConfig } from './types'

export abstract class BaseStateDetector implements StateDetector {
  protected isStatePending(
    state: EDDNState,
    { pendingStatesToStart }: StateDetectorConfig['stateChanges']
  ) {
    return pendingStatesToStart.some((s) => s.State === state)
  }

  protected isStateActive(
    state: EDDNState,
    { activeStatesToStart }: StateDetectorConfig['stateChanges']
  ) {
    return activeStatesToStart.some((s) => s.State === state)
  }

  protected isStateEnding(state: EDDNState, { statesToEnd }: StateDetectorConfig['stateChanges']) {
    return statesToEnd.some((s) => s.stateName === state.toString())
  }

  protected addNotificationToQueue<T extends keyof EventTypeMap>({
    systemName,
    trackedFaction,
    factionFromEvent,
    timestamp,
    type,
    data,
  }: {
    systemName: string
    trackedFaction: StateDetectorConfig['trackedFaction']
    factionFromEvent: StateDetectorConfig['factionFromEvent']
    timestamp: string
    type: T
    data: EventTypeMap[T]
  }) {
    return DiscordNotificationQueue.add(
      `${DISCORD_NOTIFICATION_JOB_NAME}:${systemName}:${trackedFaction.name}:${type}`,
      {
        systemName,
        factionName: trackedFaction.name,
        factionInfluence: factionFromEvent.Influence,
        timestamp,
        event: {
          type,
          data,
        },
      }
    )
  }

  abstract detect(config: StateDetectorConfig): Promise<void>
}
