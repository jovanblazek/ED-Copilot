import type { CodegenConfig } from '@graphql-codegen/cli'
import 'dotenv/config'

const ELITEHUB_VAULT_API_URL = 'https://elitehub-vault.jtblazek.sk/graphql'

if (!process.env.ELITEHUB_VAULT_API_KEY) {
  throw new Error('Missing ELITEHUB_VAULT_API_KEY required for GraphQL schema generation')
}

const CodegenConfigObject: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      [ELITEHUB_VAULT_API_URL]: {
        headers: {
          'x-api-key': process.env.ELITEHUB_VAULT_API_KEY,
        },
      },
    },
  ],
  documents: ['src/graphql/documents/**/*.graphql'],
  generates: {
    './src/graphql/generated/': {
      preset: 'client',
      plugins: [],
      config: {
        avoidOptionals: true,
        enumsAsTypes: true,
        useTypeImports: true,
      },
    },
    './src/graphql/generated/schema.json': {
      plugins: ['introspection'],
    },
    './src/graphql/generated/schema-types.ts': {
      plugins: ['typescript'],
      config: {
        avoidOptionals: true,
        enumsAsTypes: true,
        useTypeImports: true,
      },
    },
  },
}

export default CodegenConfigObject
