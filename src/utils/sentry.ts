import * as Sentry from '@sentry/node'

const SENTRY_DSN = process.env.SENTRY_DSN
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

if (SENTRY_DSN && IS_PRODUCTION) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
    release: process.env.npm_package_version, 
    normalizeDepth: 6,
  })
}