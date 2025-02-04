import RedisClient from 'ioredis'
import { TrackedFaction } from '../types/redis'
import { RedisKeys } from '../constants'
import { Prisma } from './prismaClient'

const { DRAGONFLY_PORT, DRAGONFLY_PASSWORD, DRAGONFLY_HOST } = process.env

export const Redis = new RedisClient({
  port: parseInt(DRAGONFLY_PORT, 10),
  password: DRAGONFLY_PASSWORD,
  host: DRAGONFLY_HOST,
  maxRetriesPerRequest: null,
})

export const getTrackedFactions = async () => {
  const trackedFactionsStringified = await Redis.get(RedisKeys.trackedFactions)
  if (!trackedFactionsStringified) {
    return []
  }

  return JSON.parse(trackedFactionsStringified) as TrackedFaction[]
}

export const loadTrackedFactionsFromDBToRedis = async () => {
  const trackedFactions = await Prisma.faction.findMany()
  await Redis.set(RedisKeys.trackedFactions, JSON.stringify(trackedFactions))
}
