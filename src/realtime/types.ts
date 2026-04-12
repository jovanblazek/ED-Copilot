import { z } from 'zod'

export const SseEventTypes = ['factionStateChanged', 'factionControlThreatChanged'] as const

export type SseEventType = (typeof SseEventTypes)[number]

export const FACTION_IDS_PER_SSE_CONNECTION = 20

const FactionStateLifecycleSchema = z.enum(['pending', 'active', 'ended'])

// Timestamps are in the format "2026-04-12 15:07:12.844429+00"
// TODO (jovanblazek): Update vault to use ISO 8601 timestamps
const normalizeSseTimestamp = (timestamp: string) =>
  timestamp
    .trim()
    .replace(' ', 'T')
    .replace(/([+-]\d{2})$/, '$1:00')

const SseTimestampSchema = z
  .string()
  .transform(normalizeSseTimestamp)
  .pipe(
    z.iso.datetime({
      offset: true,
    })
  )

const BaseFactionStateChangedEventSchema = z.object({
  event: z.literal('factionStateChanged'),
  factionId: z.uuid(),
  systemId: z.uuid(),
  state: z.string(),
  lifecycle: FactionStateLifecycleSchema,
  timestamp: SseTimestampSchema,
})

export const FactionStateChangedEventSchema = z.discriminatedUnion('stateKind', [
  BaseFactionStateChangedEventSchema.extend({
    stateKind: z.literal('state'),
  }),
  BaseFactionStateChangedEventSchema.extend({
    stateKind: z.literal('conflict'),
    opponentFactionId: z.uuid(),
  }),
])

export const FactionControlThreatChangedEventSchema = z.object({
  event: z.literal('factionControlThreatChanged'),
  factionId: z.uuid(),
  systemId: z.uuid(),
  status: z.enum(['entered', 'cleared']),
  challengerFactionId: z.uuid(),
  gap: z.number(),
  threshold: z.number(),
  timestamp: SseTimestampSchema,
})

export const SseEventSchemaMap = {
  factionStateChanged: FactionStateChangedEventSchema,
  factionControlThreatChanged: FactionControlThreatChangedEventSchema,
} as const

export type FactionStateChangedEvent = z.infer<typeof FactionStateChangedEventSchema>
export type FactionControlThreatChangedEvent = z.infer<
  typeof FactionControlThreatChangedEventSchema
>

export type SseEventPayloadMap = {
  factionStateChanged: FactionStateChangedEvent
  factionControlThreatChanged: FactionControlThreatChangedEvent
}

export type SseSubscription = {
  eventType: SseEventType
  factionIds: string[]
}
