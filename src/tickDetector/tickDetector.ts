import * as Sentry from '@sentry/node'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { bold, hyperlink } from 'discord.js'
import { ChannelType, type Client } from 'discord.js'
import { Subscriber } from 'zeromq'
import { inflateSync } from 'zlib'
import { RedisKeys } from '../constants'
import { createEmbed } from '../embeds'
import L from '../i18n/i18n-node'
import { getCachedTickTimeUTC, Prisma, saveTickTimeToRedis } from '../utils'
import logger from '../utils/logger'
import { Redis } from '../utils/redis'
import type { TickMessage } from './types'

const TICK_DETECTOR_HOST = 'tcp://infomancer.uk'
const TICK_DETECTOR_PORT = 5551
const TICK_DETECTOR_URL = `${TICK_DETECTOR_HOST}:${TICK_DETECTOR_PORT}`

const TOPIC_HEARTBEAT = 'HeartBeat'
const TOPIC_GALAXY_TICK = 'GalaxyTick'
const TOPIC_SYSTEM_TICK = 'SystemTick'

// TODO: report tick using queue, update text with disclaimer about tick detection delays
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

const cleanupProcessedSystem = async (systemName: string) => {
  const oldKeys = await Redis.keys(RedisKeys.processedSystem({ systemName, tickTimestamp: '*' }))
  if (oldKeys.length > 0) {
    await Redis.del(oldKeys)
  }
}

const processSystemTick = async (payload: TickMessage) => {
  try {
    if (payload.metrics.tickPass !== 'Either' && payload.metrics.tickPass !== 'Inf') {
      return
    }

    const tickTime = dayjs.utc(payload.timestamp)
    if (!tickTime.isValid()) {
      return
    }

    const cachedSystemTickTime = await getCachedTickTimeUTC({ system: payload.system })
    if (cachedSystemTickTime && tickTime.isSame(cachedSystemTickTime)) {
      logger.warn(`[Tick Detector] Tick already exists in cache for ${payload.system}`)
      return
    }
    await saveTickTimeToRedis({
      system: payload.system,
      tickTime,
    })
    await cleanupProcessedSystem(payload.system)
  } catch (error) {
    logger.error(error, '[Tick Detector] Error processing system tick')
    Sentry.captureException(error)
  }
}

const processGalaxyTick = async (payload: TickMessage, client: Client) => {
  try {
    const tickTime = dayjs.utc(payload.timestamp)
    if (!tickTime.isValid()) {
      return
    }

    const cachedGalaxyTickTime = await getCachedTickTimeUTC()
    if (cachedGalaxyTickTime && tickTime.isSame(cachedGalaxyTickTime)) {
      logger.info('[Tick Detector] Tick already exists in cache')
      return
    }

    logger.info(`[Tick Detector] Galaxy tick detected in ${payload.system}`, tickTime.format())
    await saveTickTimeToRedis({ tickTime })
    await reportTick(client, tickTime)
  } catch (error) {
    logger.error(error, '[Tick Detector] Error processing galaxy tick')
    Sentry.captureException(error)
  }
}

export default async (client: Client) => {
  const socket = new Subscriber()
  socket.connect(TICK_DETECTOR_URL)

  socket.subscribe(TOPIC_HEARTBEAT)
  socket.subscribe(TOPIC_GALAXY_TICK)
  socket.subscribe(TOPIC_SYSTEM_TICK)

  logger.info(`[Tick Detector] Connected to ${TICK_DETECTOR_URL}`)

  for await (const [topic, msg] of socket) {
    const topicString = topic.toString()
    try {
      const payloadString = inflateSync(msg).toString()
      const payload = JSON.parse(payloadString)

      switch (topicString) {
        case TOPIC_HEARTBEAT:
          logger.info('[Tick Detector] Heartbeat received')
          // TODO: update galaxy tick time using payload.lastGalaxyTick
          break
        case TOPIC_GALAXY_TICK:
          await processGalaxyTick(payload as TickMessage, client)
          break
        case TOPIC_SYSTEM_TICK:
          await processSystemTick(payload as TickMessage)
          break
        default:
          logger.warn(`[Tick Detector] Unhandled topic: ${topicString}`)
      }
    } catch (error) {
      logger.error(error, `[Tick Detector] Error processing message on topic ${topicString}`)
      Sentry.captureException(error)
    }
  }
}
