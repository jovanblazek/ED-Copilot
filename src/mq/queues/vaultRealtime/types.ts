import type { SseEventPayloadMap, SseEventType } from '../../../realtime/types'

export type VaultRealtimeJobData<T extends SseEventType = SseEventType> = {
  eventType: T
  payload: SseEventPayloadMap[T]
  receivedAt: string
  subscription: {
    key: string
    factionIds: string[]
  }
}
