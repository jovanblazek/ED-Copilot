import { Guild } from 'discord.js'
import { Languages } from '../constants'
import logger from './logger'
import { Prisma } from './prismaClient'

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
