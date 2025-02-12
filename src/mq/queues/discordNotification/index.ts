import { Queue, Worker } from 'bullmq'
import logger from '../../../utils/logger'
import { Redis } from '../../../utils/redis'
import { QueueNames } from '../../constants'
import { DiscordNotificationJobData, EventTypeMap } from './types'
import { processConflictEvent } from './processors/conflict'
import { Client } from 'discord.js'
import { Prisma } from '../../../utils'
import { processExpansionEvent } from './processors/expansion'

const ConflictEventTypes = ['conflictPending', 'conflictStarted', 'conflictEnded'] as const
const ExpansionEventTypes = ['expansionPending', 'expansionStarted', 'expansionEnded'] as const
const RetreatEventTypes = ['retreatPending', 'retreatStarted', 'retreatEnded'] as const

type ConflictEventType = (typeof ConflictEventTypes)[number]
type ExpansionEventType = (typeof ExpansionEventTypes)[number]
type RetreatEventType = (typeof RetreatEventTypes)[number]

export const DiscordNotificationQueue = new Queue<DiscordNotificationJobData<keyof EventTypeMap>>(QueueNames.discordNotification, {
  connection: Redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000 * 60,
    },
    removeOnComplete: 100,
    removeOnFail: 1000,
  },
})

export const CreateDiscordNotificationWorker = ({ client }: { client: Client }) =>
  new Worker<DiscordNotificationJobData<keyof EventTypeMap>>(
    QueueNames.discordNotification,
    async (job) => {
      logger.info(job.data, 'Processing discord notification job')

      const { event, factionName } = job.data

      const guildFactions = await Prisma.guildFaction.findMany({
        where: {
          notificationChannelId: {
            not: null,
          },
          faction: {
            name: factionName,
          },
        },
        include: {
          guild: true,
          faction: true,
        }
      })
    
      if (guildFactions.length === 0) {
        return
      }

      if (ConflictEventTypes.includes(event.type as ConflictEventType)) {
        await processConflictEvent({
          client,
          jobData: job.data as DiscordNotificationJobData<ConflictEventType>,
          guildFactions,
        })
      } else if (ExpansionEventTypes.includes(event.type as ExpansionEventType)) {
        await processExpansionEvent({
          client,
          jobData: job.data as DiscordNotificationJobData<ExpansionEventType>,
          guildFactions,
        })
      } else if (RetreatEventTypes.includes(event.type as RetreatEventType)) {
        // TODO: Send retreat notification
      }

      return job.data
    },
    {
      connection: Redis,
      limiter: {
        max: 5,
        duration: 1000,
      },
    }
  )
