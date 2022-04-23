/* eslint-disable @typescript-eslint/no-explicit-any */
import { createLogger, format, transports } from 'winston'
import './environment'

type LogItem = {
  level: string
  message: string
  data?: Record<any, any>
  error?: string
  timestamp?: string
}

const formatData = (item: LogItem) => (item.data ? ` - ${JSON.stringify(item.data)}` : '')
const formatError = (item: LogItem) => (item.error ? ` - ${item.error}` : '')

const initLogger = () => {
  if (process.env.NODE_ENV !== 'development') {
    return createLogger({
      level: process.env.LOG_LEVEL || 'debug',
    })
  }
  return createLogger({
    level: 'debug',
    format: format.combine(
      format.colorize(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(
        (item: LogItem) =>
          `${item.timestamp || ''} [${item.level}]: ${item.message}${formatData(item)}${formatError(
            item
          )}`
      )
    ),
    transports: [new transports.Console()],
  })
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const logger = initLogger()

export default {
  /* eslint-disable */
  debug: (message: string, ...args: any) => logger.debug(message, ...args),
  info: (message: string, info?: Object | unknown, ...args: any) => logger.info(message, info, ...args),
  warn: (message: string, ...args: any) => logger.warn(message, ...args),
  error: (message: string, error?: Object | unknown, ...args: any) => logger.error(message, error, ...args),
  /* eslint-enable */
}
