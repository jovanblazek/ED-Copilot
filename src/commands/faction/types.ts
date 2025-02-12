import type { Faction, GuildFaction } from '@prisma/client'
import type { CommandHandler } from '../types'

export type FactionCommandHandler = CommandHandler<{
  guildFaction: GuildFaction
  faction: Faction
}>
