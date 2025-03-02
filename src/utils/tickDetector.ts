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
import { fetchTickTime, getCachedTickTimeUTC, saveTickTimeToRedis } from './tick'

const TICK_DETECTOR_URL = 'https://tick.edcd.io'
const RECONNECT_DELAY = 60000 // 1 minute
const MAX_RECONNECT_DELAY = 480000 // 8 minutes
const HEALTH_CHECK_INTERVAL = 3600000 // 1 hour
const EXPECTED_TICK_INTERVAL = 24 // hours

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
    transports: ['polling', 'websocket'],
    timeout: 60000,
  })

  let isShuttingDown = false
  let lastConnectionTime = dayjs()

  const processTickData = async (data: string | number | Date) => {
    try {
      if (!data) {
        logger.warn('[Tick Detector] Received empty tick data')
        return
      }

      const tickTime = dayjs.utc(data)
      if (!tickTime.isValid()) {
        logger.warn('[Tick Detector] Received invalid tick time format', data)
        return
      }

      const cachedTickTime = await getCachedTickTimeUTC()
      if (cachedTickTime && tickTime.isSame(cachedTickTime)) {
        logger.info('[Tick Detector] Tick already exists in cache')
        return
      }

      logger.info('[Tick Detector] Tick detected', tickTime.format())
      await saveTickTimeToRedis(tickTime)
      await reportTick(client, tickTime)
      await cleanupProcessedSystems()
    } catch (error) {
      logger.error(error, '[Tick Detector] Error processing tick data')
      Sentry.captureException(error)
    }
  }

  socket.on('message', processTickData)
  socket.on('tick', processTickData)

  socket.on('connect', () => {
    logger.info('[Tick Detector] Connected')
    logger.info(`[Tick Detector] Using transport: ${socket.io.engine.transport.name}`)
    lastConnectionTime = dayjs()
  })

  socket.on('reconnect', (attemptNumber) => {
    logger.info(`[Tick Detector] Reconnected after ${attemptNumber} attempts`)
  })

  socket.on('reconnect_attempt', (attemptNumber) => {
    logger.info(`[Tick Detector] Reconnection attempt ${attemptNumber}`)
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

  socket.on('error', (error) => {
    if (!isShuttingDown) {
      logger.error(error, '[Tick Detector] Socket error')
    }
  })

  socket.io.engine.on('upgrade', () => {
    logger.info(`[Tick Detector] Transport upgraded to: ${socket.io.engine.transport.name}`)
  })

  const healthCheck = async () => {
    if (isShuttingDown) {
      return
    }

    try {
      const cachedTickTime = await getCachedTickTimeUTC()
      const now = dayjs()

      // Should not happen
      if (!cachedTickTime) {
        logger.warn('[Tick Detector] No tick time in cache, checking connection')
        // If we've been connected for more than 2 hours with no tick, reconnect
        if (now.diff(lastConnectionTime, 'hour') > 2) {
          logger.warn(
            '[Tick Detector] Connected for 2+ hours with no tick data, forcing reconnection'
          )
          socket.disconnect().connect()
        }
        return
      }

      const hoursSinceLastTick = now.diff(cachedTickTime, 'hour')
      logger.info(`[Tick Detector] Hours since last tick: ${hoursSinceLastTick}`)

      // Only reconnect if we've exceeded the expected tick interval
      if (hoursSinceLastTick >= EXPECTED_TICK_INTERVAL) {
        logger.warn(
          `[Tick Detector] No tick received for ${hoursSinceLastTick} hours (expected ~${EXPECTED_TICK_INTERVAL}h), forcing reconnection`
        )

        if (socket.connected) {
          socket.disconnect().connect()
        } else {
          socket.connect()
        }

        // Also fetch the latest tick via HTTP API as a fallback
        try {
          const tickTimeFromApi = await fetchTickTime()
          if (tickTimeFromApi?.toISOString()) {
            logger.info('[Tick Detector] Fetched latest tick via HTTP API')
            await processTickData(tickTimeFromApi.toISOString())
          }
        } catch (httpError) {
          logger.error(httpError, '[Tick Detector] Error fetching tick via HTTP API')
        }
      } else {
        logger.info('[Tick Detector] Health check OK - tick timing within expected range')
      }
    } catch (error) {
      logger.error(error, '[Tick Detector] Error in health check')
      Sentry.captureException(error)
    }
  }

  // Run health check at startup to ensure we have the latest tick
  void healthCheck()

  const healthCheckInterval = setInterval(() => {
    void healthCheck()
  }, HEALTH_CHECK_INTERVAL)

  const cleanup = () => {
    isShuttingDown = true
    clearInterval(healthCheckInterval)

    if (socket) {
      try {
        socket.disconnect()
        logger.info('[Tick Detector] Closed connection')
      } catch (error) {
        logger.error(error, '[Tick Detector] Error closing connection')
      }
    }
  }

  return cleanup
}
