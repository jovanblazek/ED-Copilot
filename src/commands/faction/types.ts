import type { Faction } from '@prisma/client'
import type { CommandHandler } from '../types'

export type FactionCommandHandler = CommandHandler<{
  faction: Faction
}>
