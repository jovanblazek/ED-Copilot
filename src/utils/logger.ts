import pino from 'pino'
import './environment'

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

// eslint-disable-next-line @typescript-eslint/naming-convention
const logger = pino({
  level: IS_PRODUCTION ? 'info' : 'debug',
  enabled: process.env.NODE_ENV !== 'test',
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        level: 'debug',
        options: {
          colorize: true,
          translateTime: `UTC:yyyy-mm-dd'T'HH:MM:ss'Z'`,
          singleLine: true,
        },
      },
    ],
  },
})

export default logger
