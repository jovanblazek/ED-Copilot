import dayjs, { Dayjs } from 'dayjs'
import { bold, ChannelType, Client, hyperlink } from 'discord.js'
import { io } from 'socket.io-client'
import { RedisKeys } from '../constants'
import { createEmbed } from '../embeds'
import L from '../i18n/i18n-node'
import logger from './logger'
import { Prisma } from './prismaClient'
import { Redis } from './redis'

const reportTick = async (client: Client, tickTime: Dayjs) => {
  const guilds = await Prisma.preferences.findMany({
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

export default (client: Client) => {
  const socket = io('https://tick.edcd.io/', {
    reconnectionDelay: 60000, // 1 minute
    reconnectionDelayMax: 480000, // 8 minutes
    transports: ['websocket'],
  })

  socket.on('connect', () => {
    logger.info('Connected to Tick Detector')
  })

  socket.on('tick', async (data: string | number | Date) => {
    const tickTime = dayjs.utc(data)
    logger.info('Tick detected', tickTime)
    await Redis.set(RedisKeys.ticktime, tickTime.toISOString())
    void reportTick(client, tickTime)
    await cleanupProcessedSystems()
  })

  socket.on('connect_error', (error) => {
    // We don't want to spam the logs with connection errors
    logger.warn(error, 'Error while connecting to Tick Detector')
  })
}
