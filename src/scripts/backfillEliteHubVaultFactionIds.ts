import { createEliteHubVaultClient } from '../graphql/client'
import { Prisma } from '../utils'
import logger from '../utils/logger'
import '../utils/environment'

type BackfillResult =
  | { status: 'updated'; factionName: string; elitehubVaultId: string }
  | { status: 'missing'; factionName: string }

const DRY_RUN = process.argv.includes('--dry-run')
const QUERY_BATCH_SIZE = 20

type FactionIdLookupResponse = Record<
  string,
  {
    id: string
  } | null
>

type FactionBackfillCandidate = {
  id: number
  name: string
  eddbId: number
}

const chunk = <T>(items: T[], size: number): T[][] => {
  const chunks: T[][] = []

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size))
  }

  return chunks
}

const createFactionIdsQuery = (factions: FactionBackfillCandidate[]) => {
  const selections = factions.map((faction) => {
    const alias = `eddb_${faction.eddbId}`

    return `${alias}: factionByName(name: ${JSON.stringify(faction.name)}) { id }`
  })

  return `query BackfillEliteHubVaultFactionIds { ${selections.join('\n')} }`
}

const backfillEliteHubVaultFactionIds = async () => {
  const factions = await Prisma.faction.findMany({
    where: {
      elitehubVaultId: null,
    },
    select: {
      id: true,
      name: true,
      eddbId: true,
    },
    orderBy: {
      id: 'asc',
    },
  })

  if (!factions.length) {
    logger.info('No factions require elitehubVaultId backfill.')
    return
  }

  logger.info(`Found ${factions.length} faction(s) without elitehubVaultId.`)

  const uniqueFactionsByEddbId = Array.from(
    new Map(factions.map((faction) => [faction.eddbId, faction] as const)).values()
  )

  if (uniqueFactionsByEddbId.length !== factions.length) {
    logger.info(
      `Deduplicated faction lookup set from ${factions.length} to ${uniqueFactionsByEddbId.length} by eddbId.`
    )
  }

  const elitehubVaultIdByEddbId = new Map<number, string | null>()
  const factionBatches = chunk(uniqueFactionsByEddbId, QUERY_BATCH_SIZE)

  const client = createEliteHubVaultClient()
  await Promise.all(
    factionBatches.map(async (factionBatch) => {
      const query = createFactionIdsQuery(factionBatch)
      const response = await client.request<FactionIdLookupResponse>(query)

      factionBatch.forEach((faction) => {
        elitehubVaultIdByEddbId.set(faction.eddbId, response[`eddb_${faction.eddbId}`]?.id ?? null)
      })
    })
  )

  const results = await Promise.all(
    factions.map(async (faction): Promise<BackfillResult> => {
      const elitehubVaultId = elitehubVaultIdByEddbId.get(faction.eddbId) ?? null

      if (!elitehubVaultId) {
        logger.warn(`No elitehubVaultId found for faction "${faction.name}".`)
        return {
          status: 'missing',
          factionName: faction.name,
        }
      }

      if (DRY_RUN) {
        logger.info(`[dry-run] Would set ${faction.name} -> ${elitehubVaultId}`)
      } else {
        await Prisma.faction.update({
          where: {
            id: faction.id,
          },
          data: {
            elitehubVaultId,
          },
        })
        logger.info(`Updated ${faction.name} -> ${elitehubVaultId}`)
      }

      return {
        status: 'updated',
        factionName: faction.name,
        elitehubVaultId,
      }
    })
  )

  const updatedCount = results.filter((result) => result.status === 'updated').length
  const missingFactions = results
    .filter((result) => result.status === 'missing')
    .map((result) => result.factionName)

  logger.info(
    `Backfill finished. Updated ${updatedCount} faction(s). Missing ${missingFactions.length}.`
  )

  if (missingFactions.length) {
    logger.error('Factions without a matching elitehubVaultId:')
    missingFactions.forEach((factionName) => {
      logger.error(`- ${factionName}`)
    })
    process.exitCode = 1
  }
}

const run = async () => {
  try {
    await backfillEliteHubVaultFactionIds()
  } catch (error: unknown) {
    logger.error(error, 'Failed to backfill elitehubVaultId values.')
    process.exitCode = 1
  } finally {
    await Prisma.$disconnect()
  }
}

void run()
