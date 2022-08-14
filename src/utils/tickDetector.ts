import dayjs from 'dayjs'
import { Client } from 'discord.js'
import { io } from 'socket.io-client'
import { Commands } from '../commands'
import logger from './logger'

export default (client: Client) => {
  const socket = io('http://tick.phelbore.com:31173')

  socket.on('connect', () => {
    logger.info('Connected to Tick Detector')
  })

  socket.on('tick', (data: string | number | Date) => {
    logger.info('Tick detected', dayjs.utc(data))
    void Commands.tick.reportTick(client)
  })
}
