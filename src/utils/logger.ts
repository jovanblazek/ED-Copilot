import pino from 'pino'
import pretty from 'pino-pretty'
import { createWriteStream } from 'pino-sentry'
import './environment'

const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const SentryStream = createWriteStream({ dsn: process.env.SENTRY_DSN, level: 'warning' })
const PrettyConsoleStream = pretty({
  colorize: true,
})

// eslint-disable-next-line @typescript-eslint/naming-convention
const logger = pino(
  {
    level: IS_PRODUCTION ? 'info' : 'debug',
    enabled: process.env.NODE_ENV !== 'test',
  },
  pino.multistream([PrettyConsoleStream, ...(IS_PRODUCTION ? [SentryStream] : [])])
)

export default logger
