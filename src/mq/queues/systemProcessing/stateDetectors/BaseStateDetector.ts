/* eslint-disable class-methods-use-this */
import { EDDNState } from '../../../../types/eddn'
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

  abstract detect(config: StateDetectorConfig): Promise<void>
}
