import { chunk, uniq } from 'lodash'
import type { SseSubscription } from './types'
import { FACTION_IDS_PER_SSE_CONNECTION, SseEventTypes } from './types'

export const buildSseSubscriptions = ({
  factionIds,
  chunkSize = FACTION_IDS_PER_SSE_CONNECTION,
}: {
  factionIds: string[]
  chunkSize?: number
}): SseSubscription[] => {
  const uniqueSortedFactionIds = uniq(factionIds).sort((a, b) => a.localeCompare(b))

  return SseEventTypes.flatMap((eventType) =>
    chunk(uniqueSortedFactionIds, chunkSize).map((factionIdsChunk) => ({
      eventType,
      factionIds: factionIdsChunk,
    }))
  )
}

export const getSseSubscriptionKey = ({ eventType, factionIds }: SseSubscription) =>
  `${eventType}:${factionIds.join(',')}`
