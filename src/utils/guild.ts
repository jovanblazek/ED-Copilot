import { Guild } from 'discord.js'
import Keyv from 'keyv'
import { CacheNames, Languages } from '../constants'
import Faction, { FactionType } from '../schemas/Faction'
import Preferences from '../schemas/Preferences'
import logger from './logger'
import { Prisma } from './prismaClient'

export const refreshGuildPreferencesCache = async (cache: Keyv) => {
  const guildPreferences = await Preferences.find({})
  const guildPreferencesMap = guildPreferences.reduce(
    (preferences, preference) => ({
      ...preferences,
      [preference.guildId]: preference,
    }),
    {}
  )
  await cache.set(CacheNames.guildPreferences, guildPreferencesMap)
}

export const refreshGuildFactionCache = async (cache: Keyv) => {
  const guildFactions = await Faction.find({})
  const guildFactionsMap = guildFactions.reduce(
    (factions, faction) => ({
      ...factions,
      [faction.guildId]: faction,
    }),
    {}
  )
  await cache.set(CacheNames.guildFactions, guildFactionsMap)
}

export const onGuildJoin = async ({ id, name }: Guild) => {
  logger.info(`Joined guild ${name}, id: ${id}`)
  try {
    await Prisma.preferences.create({
      data: {
        guildId: id,
        tickReportChannelId: null,
        language: Languages.english,
        timezone: 'UTC',
      },
    })
  } catch (error) {
    logger.error(`Error while creating guild preferences for guild ${name}`, error)
  }
}

export const onGuildLeave = async ({ id, name }: Guild) => {
  logger.info(`Left guild ${name}, id: ${id}`)
  try {
    await Prisma.preferences.delete({ where: { guildId: id } })
  } catch (error) {
    logger.error(`Error while deleting guild preferences for guild ${name}`, error)
  }
}

export const getCachedFaction = async (cache: Keyv, guildId: string) => {
  const cachedFactions = (await cache.get(CacheNames.guildFactions)) as {
    [guildId: string]: FactionType
  }
  if (!cachedFactions) {
    throw new Error('No factions cached')
  }
  return cachedFactions[guildId]
}
