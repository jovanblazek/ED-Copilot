import { Guild } from 'discord.js'
import Keyv from 'keyv'
import { CacheNames, Languages } from '../constants'
import Faction, { FactionType } from '../schemas/Faction'
import Preferences from '../schemas/Preferences'
import logger from './logger'

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

export const onGuildJoin = async (guild: Guild) => {
  logger.info(`Joined guild ${guild.name}, id: ${guild.id}`)
  try {
    await Preferences.create({
      guildId: guild.id,
      tickReportChannelId: null,
      language: Languages.english,
    })
  } catch (error) {
    logger.error(`Error while creating guild preferences for guild ${guild.name}`, error)
  }
}

export const onGuildLeave = async (guild: Guild) => {
  logger.info(`Left guild ${guild.name}, id: ${guild.id}`)
  try {
    await Preferences.deleteOne({ guildId: guild.id })
  } catch (error) {
    logger.error(`Error while deleting guild preferences for guild ${guild.name}`, error)
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
