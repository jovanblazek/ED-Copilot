import dayjs from 'dayjs'
import { io } from 'socket.io-client'
import logger from './logger'
import { setTickTime } from './tick'

export default () => {
  const socket = io('https://tick.edcd.io/')

  socket.on('connect', () => {
    logger.info('Connected to Tick Detector')
  })

  socket.on('tick', (data: string | number | Date) => {
    const tickTime = dayjs.utc(data)
    logger.info('Tick detected', tickTime)
    setTickTime(tickTime)
    // void Commands.tick.reportTick(client)
  })

  socket.on('connect_error', (error) => {
    logger.error(error, 'Error while connecting to Tick Detector')
  })
}
