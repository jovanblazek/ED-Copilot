import { GraphQLClient } from 'graphql-request'

const ELITEHUB_VAULT_API_URL = 'https://elitehub-vault.jtblazek.sk/graphql'

export const createEliteHubVaultClient = () => {
  if (!process.env.ELITEHUB_VAULT_API_KEY) {
    throw new Error('Missing ELITEHUB_VAULT_API_KEY')
  }

  return new GraphQLClient(ELITEHUB_VAULT_API_URL, {
    headers: {
      'x-api-key': process.env.ELITEHUB_VAULT_API_KEY,
    },
  })
}
