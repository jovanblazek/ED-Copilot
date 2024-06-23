export const CommandNames = {
  nearest: 'nearest',
  systemDistance: 'distance',
  tick: 'tick',
  systemInfo: 'system',
  faction: 'faction',
  commanderProfile: 'profile',
  setup: 'setup',
  copilot: 'copilot',
} as const

export const NearestSubcommands = {
  broker: 'broker',
  trader: 'trader',
  factors: 'factors',
} as const

export const FactionSubcommands = {
  systems: 'systems',
  conflicts: 'conflicts',
  stations: 'stations',
} as const

export const CopilotSubcommands = {
  faction: 'faction',
  tick: 'tick',
  language: 'language',
  timezone: 'timezone',
} as const

export const SetupSubcommands = {
  profile: 'profile',
} as const

export const PaginationButtonNames = {
  LEFT: 'left',
  RIGHT: 'right',
} as const

export const PAGINATION_COLLECTION_TIME = 20000
export const EMBED_COLOR = '#5865F2'
export const DIVIDER = '━━━━━━━━━━━━━━━━━━━━━━━━━━'

export const Emojis = {
  system: '<:system:822765748111671326>',
  coriolis: '<:coriolis:822765325350076426>',
  outpost: '<:outpost:822765313870397460>',
  surfacePort: '<:surface:822765337548029962>',
  other: '<:other:822765350536871946>',
  green_upwards_arrow: '<:arrow_green:842824851072614487>',
  red_downwards_arrow: '<:arrow_red:842824890918764544>',
} as const

export enum StationType {
  Coriolis,
  Outpost,
  SurfacePort,
  Other,
}

export const StationTypeEmojis = {
  [StationType.Coriolis]: Emojis.coriolis,
  [StationType.Outpost]: Emojis.outpost,
  [StationType.SurfacePort]: Emojis.surfacePort,
  [StationType.Other]: Emojis.other,
} as const

export const InaraUrl = {
  minorFaction: (factionName: string) =>
    `https://inara.cz/minorfaction/?search=${encodeURIComponent(factionName)}`,
  minorFactionAssets: (factionName: string) =>
    `https://inara.cz/elite/minorfaction-assets/?search=${encodeURIComponent(factionName)}`,
} as const

export const Languages = {
  english: 'en',
  slovak: 'sk',
} as const

export const CacheNames = {
  guildPreferences: 'preferences',
  guildFactions: 'factions',
} as const

export const RankNames = {
  combat: 'Combat',
  trade: 'Trade',
  exploration: 'Exploration',
  cqc: 'CQC',
  soldier: 'Mercenary',
  exobiologist: 'Exobiologist',
  federation: 'Federation',
  empire: 'Empire',
} as const

export const Ranks = {
  combat: [
    'Harmless',
    'Mostly Harmless',
    'Novice',
    'Competent',
    'Expert',
    'Master',
    'Dangerous',
    'Deadly',
    'Elite',
    'Elite I',
    'Elite II',
    'Elite III',
    'Elite IV',
    'Elite V',
  ],
  trade: [
    'Penniless',
    'Mostly Penniless',
    'Peddler',
    'Dealer',
    'Merchant',
    'Broker',
    'Entrepreneur',
    'Tycoon',
    'Elite',
    'Elite I',
    'Elite II',
    'Elite III',
    'Elite IV',
    'Elite V',
  ],
  exploration: [
    'Aimless',
    'Mostly Aimless',
    'Scout',
    'Surveyor',
    'Trailblazer',
    'Pathfinder',
    'Ranger',
    'Pioneer',
    'Elite',
    'Elite I',
    'Elite II',
    'Elite III',
    'Elite IV',
    'Elite V',
  ],
  cqc: [
    'Helpless',
    'Mostly Helpless',
    'Amateur',
    'Semi Professional',
    'Professional',
    'Champion',
    'Hero',
    'Legend',
    'Elite',
    'Elite I',
    'Elite II',
    'Elite III',
    'Elite IV',
    'Elite V',
  ],
  soldier: [
    'Defenceless',
    'Mostly Defenceless',
    'Rookie',
    'Soldier',
    'Gunslinger',
    'Warrior',
    'Gladiator',
    'Deadeye',
    'Elite',
    'Elite I',
    'Elite II',
    'Elite III',
    'Elite IV',
    'Elite V',
  ],
  exobiologist: [
    'Directionless',
    'Mostly Directionless',
    'Compiler',
    'Collector',
    'Cataloguer',
    'Taxonomist',
    'Ecologist',
    'Geneticist',
    'Elite',
    'Elite I',
    'Elite II',
    'Elite III',
    'Elite IV',
    'Elite V',
  ],
  federation: [
    'None',
    'Recruit',
    'Cadet',
    'Midshipman',
    'Petty Officer',
    'Chief Petty Officer',
    'Warrant Officer',
    'Ensign',
    'Lieutenant',
    'Lieutenant Commander',
    'Post Commander',
    'Post Captain',
    'Rear Admiral',
    'Vice Admiral',
    'Admiral',
  ],
  empire: [
    'None',
    'Outsider',
    'Serf',
    'Master',
    'Squire',
    'Knight',
    'Lord',
    'Baron',
    'Viscount',
    'Count',
    'Earl',
    'Marquis',
    'Duke',
    'Prince',
    'King',
  ],
} as const
