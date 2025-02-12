import { EDDNState } from '../../../types/eddn'

// eslint-disable-next-line @typescript-eslint/naming-convention
export const CONFLICT_STATES = [EDDNState.Election, EDDNState.CivilWar, EDDNState.War]

export const EXPANSION_REDIS_EXPIRATION = 60 * 60 * 24 * 11 // 11 days

export const DISCORD_NOTIFICATION_JOB_NAME = 'discord-notification'
