import { GraphQLClient } from 'graphql-request'

export const ELITEHUB_VAULT_API_URL = 'https://elitehub-vault.jtblazek.sk/graphql'
export const ELITEHUB_VAULT_API_KEY_HEADER = 'x-api-key'

export type EliteHubVaultClient = GraphQLClient

export const getEliteHubVaultRealtimeSseUrl = ({
  eventType,
  factionIds,
}: {
  eventType: 'factionStateChanged' | 'factionControlThreatChanged'
  factionIds: string[]
}) => {
  const url = new URL('/realtime/sse', ELITEHUB_VAULT_API_URL)
  url.searchParams.set('eventType', eventType)
  factionIds.forEach((factionId) => {
    url.searchParams.append('factionId', factionId)
  })
  return url.toString()
}

export const createEliteHubVaultClient = () => {
  if (!process.env.ELITEHUB_VAULT_API_KEY) {
    throw new Error('Missing ELITEHUB_VAULT_API_KEY')
  }

  return new GraphQLClient(ELITEHUB_VAULT_API_URL, {
    headers: {
      [ELITEHUB_VAULT_API_KEY_HEADER]: process.env.ELITEHUB_VAULT_API_KEY,
    },
  })
}
