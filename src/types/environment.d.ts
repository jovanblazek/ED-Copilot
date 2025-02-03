declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      BOT_TOKEN: string
      INARA_API_KEY: string
      SENTRY_DSN: string
      DEBUG_EDDN_WORKER: 'true' | undefined

      // Postgres
      POSTGRES_PORT: string
      POSTGRES_USER: string
      POSTGRES_PASSWORD: string
      POSTGRES_DB_NAME: string
      POSTGRES_CONNECTION_STRING: string

      // Dragonfly
      DRAGONFLY_PORT: string
      DRAGONFLY_PASSWORD: string
      DRAGONFLY_HOST: string

      ENCRYPTION_KEY: string

      // Discord
      CLIENT_ID: string
      DEV_GUILD_ID: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
