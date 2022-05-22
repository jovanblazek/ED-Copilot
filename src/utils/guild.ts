import { Guild } from 'discord.js'
import Keyv from 'keyv'
import { Languages } from '../constants'
import Preferences from '../schemas/Preferences'
import logger from './logger'

export const refreshGuildCache = async (cache: Keyv) => {
  const guildPreferences = await Preferences.find({})
  const guildPreferencesMap = guildPreferences.reduce(
    (preferences, preference) => ({
      ...preferences,
      [preference.guildId]: preference,
    }),
    {}
  )
  await cache.set('preferences', guildPreferencesMap)
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
