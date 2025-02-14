import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import type { Client } from 'discord.js'
import { bold, ChannelType, hyperlink } from 'discord.js'
import { Subscriber } from 'zeromq'
import zlib from 'zlib'
import { createEmbed } from '../embeds'
import L from '../i18n/i18n-node'
import logger from './logger'
import { Prisma } from './prismaClient'
import { Redis } from './redis'
import { saveTickTimeToRedis } from './tick'

const TICK_DETECTOR_URL = 'tcp://infomancer.uk:5551'
const TOPIC = 'GalaxyTick'
const RECONNECT_DELAY = 60000 // 1 minute
const MAX_RECONNECT_DELAY = 480000 // 8 minutes

const reportTick = async (client: Client, tickTime: Dayjs) => {
  const guilds = await Prisma.guild.findMany({
    where: {
      tickReportChannelId: {
        not: null,
      },
    },
  })
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
            channel.type === ChannelType.GuildAnnouncement || channel.type === ChannelType.GuildText
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
}

const cleanupProcessedSystems = async () => {
  const oldKeys = await Redis.keys('processedSystem:*')
  if (oldKeys.length > 0) {
    await Redis.del(oldKeys)
  }
}

const connect = (socket: Subscriber) => {
  try {
    socket.connect(TICK_DETECTOR_URL)
    socket.subscribe(TOPIC)
    logger.info('[Tick Detector] Connected')
    return true
  } catch (error) {
    logger.error(error, '[Tick Detector] Failed to connect')
    return false
  }
}

export default async (client: Client) => {
  let currentDelay = RECONNECT_DELAY
  let socket: Subscriber | null = null
  let isShuttingDown = false

  const cleanup = () => {
    isShuttingDown = true
    if (socket) {
      try {
        socket.close()
        logger.info('[Tick Detector] Closed connection')
      } catch (error) {
        logger.error(error, '[Tick Detector] Error closing connection')
      }
    }
  }

  const initializeSocket = async () => {
    if (isShuttingDown) {
      return
    }

    socket = new Subscriber()
    const isConnected = connect(socket)

    if (!isConnected) {
      socket.close()
      currentDelay = Math.min(currentDelay * 2, MAX_RECONNECT_DELAY)
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      setTimeout(initializeSocket, currentDelay)
      return
    }

    currentDelay = RECONNECT_DELAY // Reset delay on successful connection

    try {
      for await (const [topic, msg] of socket) {
        if (isShuttingDown) {
          break
        }

        if (topic.toString() === TOPIC) {
          try {
            const decompressed = zlib.inflateSync(msg)
            const data = JSON.parse(decompressed.toString()) as { timestamp: string }
            const tickTime = dayjs.utc(data.timestamp)

            logger.info('[Tick Detector] Tick detected', tickTime)
            await saveTickTimeToRedis(tickTime)
            void reportTick(client, tickTime)
            await cleanupProcessedSystems()
          } catch (error) {
            logger.error(error, '[Tick Detector] Error processing tick message')
          }
        }
      }
    } catch (error) {
      if (!isShuttingDown) {
        logger.error(error, '[Tick Detector] Socket error - attempting reconnection')
        cleanup()
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        setTimeout(initializeSocket, currentDelay)
      }
    }
  }

  await initializeSocket()
  return cleanup
}
