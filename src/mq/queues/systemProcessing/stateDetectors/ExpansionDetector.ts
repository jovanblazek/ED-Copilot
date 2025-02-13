import { RedisKeys } from '../../../../constants'
import { EDDNState } from '../../../../types/eddn'
import { Redis } from '../../../../utils/redis'
import { EXPANSION_REDIS_EXPIRATION } from '../constants'
import { BaseStateDetector } from './BaseStateDetector'
import type { StateDetectorConfig } from './types'

export class ExpansionDetector extends BaseStateDetector {
  async detect({
    systemName,
    trackedFaction,
    factionFromEvent,
    timestamp,
    stateChanges,
  }: StateDetectorConfig) {
    const isExpansionPending = this.isStatePending(EDDNState.Expansion, stateChanges)
    const isExpansionActive = this.isStateActive(EDDNState.Expansion, stateChanges)
    const isExpansionEnding = this.isStateEnding(EDDNState.Expansion, stateChanges)

    const expansionRedisKey = RedisKeys.expansion({ factionId: trackedFaction.id })

    if (isExpansionPending || isExpansionActive) {
      const isFirstOccurrence = await Redis.setnx(expansionRedisKey, 1)

      if (isFirstOccurrence) {
        const isPending = stateChanges.pendingStatesToStart.some(
          (s) => s.State === EDDNState.Expansion
        )
        await this.addNotificationToQueue({
          systemName,
          trackedFaction,
          factionFromEvent,
          timestamp,
          type: isPending ? 'expansionPending' : 'expansionStarted',
          data: {},
        })
        await Redis.expire(expansionRedisKey, EXPANSION_REDIS_EXPIRATION)
      }
    }

    if (isExpansionEnding) {
      const isDeletedFromRedis = await Redis.del(expansionRedisKey)
      if (isDeletedFromRedis) {
        await this.addNotificationToQueue({
          systemName,
          trackedFaction,
          factionFromEvent,
          timestamp,
          type: 'expansionEnded',
          data: {},
        })
      }
    }
  }
}
