import dayjs from 'dayjs'
import { Client } from 'discord.js'
import { io } from 'socket.io-client'
import { Tick } from '../classes'
import tickCommand from '../commands/tick'
import logger from './logger'

export default (client: Client, CachedTick: Tick) => {
  const socket = io('http://tick.phelbore.com:31173')

  socket.on('connect', () => {
    logger.info('Connected to Tick Detector')
  })

  socket.on('tick', (data: string | number | Date) => {
    logger.info('Tick detected', dayjs.utc(data))
    CachedTick.setTicktime(dayjs.utc(data))
    void tickCommand.reportTick(client, CachedTick)
  })
}
