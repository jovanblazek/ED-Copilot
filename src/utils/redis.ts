import RedisClient from 'ioredis'
import { RedisKeys } from '../constants'
import type { TrackedFaction } from '../types/redis'
import { Prisma } from './prismaClient'

const { REDIS_PORT, REDIS_USERNAME, REDIS_PASSWORD, REDIS_HOST } = process.env

export const Redis = new RedisClient({
  port: parseInt(REDIS_PORT, 10),
  password: REDIS_PASSWORD,
  host: REDIS_HOST,
  username: REDIS_USERNAME,
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
