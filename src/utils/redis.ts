import RedisClient from 'ioredis'

const { DRAGONFLY_PORT } = process.env

export const Redis = new RedisClient({
  port: parseInt(DRAGONFLY_PORT, 10),
})
