import RedisClient from 'ioredis'

const { DRAGONFLY_PORT, DRAGONFLY_PASSWORD } = process.env

export const Redis = new RedisClient({
  port: parseInt(DRAGONFLY_PORT, 10),
  password: DRAGONFLY_PASSWORD,
})
