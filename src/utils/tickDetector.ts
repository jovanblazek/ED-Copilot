import dayjs from 'dayjs'
import { Client } from 'discord.js'
import { io } from 'socket.io-client'
import tickCommand from '../commands/tick'
import { Tick } from '../data/Tick'

export default (client: Client, SavedTick: Tick) => {
  const socket = io('http://tick.phelbore.com:31173')

  socket.on('connect', () => {
    console.log('Connected to Tick Detector')
  })

  socket.on('tick', (data: string | number | Date) => {
    console.log('Tick detected', dayjs.utc(data))
    SavedTick.setTicktime(dayjs.utc(data))
    void tickCommand.reportTick(client, SavedTick)
  })
}
