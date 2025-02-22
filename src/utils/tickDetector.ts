import * as Sentry from '@sentry/node'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import type { Client } from 'discord.js'
import { bold, ChannelType, hyperlink } from 'discord.js'
import { io } from 'socket.io-client'
import { createEmbed } from '../embeds'
import L from '../i18n/i18n-node'
import logger from './logger'
import { Prisma } from './prismaClient'
import { Redis } from './redis'
import { getCachedTickTimeUTC, saveTickTimeToRedis } from './tick'

const TICK_DETECTOR_URL = 'https://tick.edcd.io'
const RECONNECT_DELAY = 60000 // 1 minute
const MAX_RECONNECT_DELAY = 480000 // 8 minutes

const reportTick = async (client: Client, tickTime: Dayjs) => {
  try {
    const guilds = await Prisma.guild.findMany({
      where: {
        tickReportChannelId: {
          not: null,
        },
      },
    })
    logger.info(
      '[Tick Detector] Reporting tick to guilds with ids:',
      guilds.map(({ id }) => id)
    )
    if (!guilds) {
      return
    }
    // This might be an issue later on when many channels are subscribed to the tick
    await Promise.allSettled(
      guilds.map(async ({ tickReportChannelId, timezone, language }) => {
        if (tickReportChannelId) {
          const locale = language as keyof typeof L
          const channel = client.channels.cache.get(tickReportChannelId)
          if (
            !channel ||
            !(
              channel.type === ChannelType.GuildAnnouncement ||
              channel.type === ChannelType.GuildText
            )
          ) {
            return
          }
          await channel.send({
            embeds: [
              createEmbed({
                title: L[locale].tick.title(),
                description: `${bold(tickTime.tz(timezone).format('DD.MM.YYYY HH:mm'))}\n
              ${hyperlink(L[locale].tick.history(), 'https://elitebgs.app/tick')}`,
              }),
            ],
          })
        }
      })
    )
  } catch (error) {
    logger.error(error, '[Tick Detector] Error reporting tick')
    Sentry.captureException(error)
  }
}

const cleanupProcessedSystems = async () => {
  const oldKeys = await Redis.keys('processedSystem:*')
  if (oldKeys.length > 0) {
    await Redis.del(oldKeys)
  }
}

export default (client: Client) => {
  const socket = io(TICK_DETECTOR_URL, {
    reconnectionDelay: RECONNECT_DELAY,
    reconnectionDelayMax: MAX_RECONNECT_DELAY,
    transports: ['websocket'],
  })
  let isShuttingDown = false

  const cleanup = () => {
    isShuttingDown = true
    if (socket) {
      try {
        socket.disconnect()
        logger.info('[Tick Detector] Closed connection')
      } catch (error) {
        logger.error(error, '[Tick Detector] Error closing connection')
      }
    }
  }

  socket.on('connect', () => {
    logger.info('[Tick Detector] Connected')
  })

  socket.on('disconnect', (reason) => {
    if (!isShuttingDown) {
      logger.warn(`[Tick Detector] Disconnected: ${reason}`)
    }
  })

  socket.on('connect_error', (error) => {
    if (!isShuttingDown) {
      logger.error(error, '[Tick Detector] Connection error')
    }
  })

  socket.on('message', async (data: string | number | Date) => {
    try {
      const tickTime = dayjs.utc(data)
      const cachedTickTime = await getCachedTickTimeUTC()
      if (cachedTickTime && tickTime.isSame(cachedTickTime)) {
        logger.info('[Tick Detector] Tick already exists in cache')
        return
      }

      logger.info('[Tick Detector] Tick detected', tickTime)
      await saveTickTimeToRedis(tickTime)
      await reportTick(client, tickTime)
      await cleanupProcessedSystems()
    } catch (error) {
      logger.error(error, '[Tick Detector] Error processing tick message')
      Sentry.captureException(error)
    }
  })

  return cleanup
}
