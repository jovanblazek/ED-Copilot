import { z } from 'zod'

const EliteBgsFactionPresenceSchema = z.object({
  system_name: z.string(),
  influence: z.number(),
  conflicts: z.array(z.unknown()),
  updated_at: z.string(),
})

const EliteBgsFactionConflictSideSchema = z.object({
  faction_id: z.string(),
  name: z.string(),
  stake: z.string(),
  days_won: z.number(),
})

const EliteBgsSystemDetailConflictSchema = z.object({
  status: z.string(),
  faction1: EliteBgsFactionConflictSideSchema,
  faction2: EliteBgsFactionConflictSideSchema,
})

const EliteBgsFactionPresenceWithSystemDetailsSchema = z.object({
  system_name: z.string(),
  conflicts: z.array(z.unknown()),
  updated_at: z.string(),
  system_details: z.object({
    conflicts: z.array(EliteBgsSystemDetailConflictSchema),
  }),
})

const EliteBgsFactionLookupDocSchema = z.object({
  _id: z.string(),
  name: z.string(),
  eddb_id: z.number(),
  allegiance: z.string(),
  faction_presence: z.array(z.unknown()),
})

const EliteBgsFactionSystemsDocSchema = z.object({
  faction_presence: z.array(EliteBgsFactionPresenceSchema),
})

const EliteBgsFactionConflictsDocSchema = z.object({
  faction_presence: z.array(EliteBgsFactionPresenceWithSystemDetailsSchema),
})

export const EliteBgsFactionLookupResponseSchema = z.object({
  docs: z.array(EliteBgsFactionLookupDocSchema),
})

export const EliteBgsFactionSystemsResponseSchema = z.object({
  docs: z.array(EliteBgsFactionSystemsDocSchema),
})

export const EliteBgsFactionConflictsResponseSchema = z.object({
  docs: z.array(EliteBgsFactionConflictsDocSchema),
})

export type EliteBgsFactionLookupResponse = z.infer<typeof EliteBgsFactionLookupResponseSchema>
export type EliteBgsFactionSystemsResponse = z.infer<typeof EliteBgsFactionSystemsResponseSchema>
export type EliteBgsFactionConflictsResponse = z.infer<
  typeof EliteBgsFactionConflictsResponseSchema
>
