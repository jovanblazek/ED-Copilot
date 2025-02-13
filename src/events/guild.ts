import * as Sentry from '@sentry/node'
import type { Guild } from 'discord.js'
import { Languages } from '../constants'
import logger from '../utils/logger'
import { Prisma } from '../utils/prismaClient'

export const onGuildJoin = async ({ id, name }: Guild) => {
  logger.info(`Joined guild '${name}', id: ${id}`)
  try {
    await Prisma.guild.create({
      data: {
        id,
        tickReportChannelId: null,
        language: Languages.english,
        timezone: 'UTC',
      },
    })
  } catch (error) {
    logger.error(`Error while creating guild '${name}' in DB`, error)
    Sentry.setContext('Guild', {
      id,
      name,
    })
    Sentry.captureException(error)
  }
}

export const onGuildLeave = async ({ id, name }: Guild) => {
  logger.info(`Left guild '${name}', id: ${id}`)
  try {
    await Prisma.guild.delete({ where: { id } })
  } catch (error) {
    logger.error(`Error while deleting guild '${name}' in DB`, error)
    Sentry.setContext('Guild', {
      id,
      name,
    })
    Sentry.captureException(error)
  }
}
