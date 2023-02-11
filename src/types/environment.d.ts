declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'
      BOT_TOKEN: string
      INARA_API_KEY: string

      // Postgres
      POSTGRES_PORT: string
      POSTGRES_USER: string
      POSTGRES_PASSWORD: string
      POSTGRES_DB_NAME: string
      POSTGRES_CONNECTION_STRING: string

      ENCRYPTION_KEY: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
