import { Client } from 'discord.js'
import logger from '../utils/logger'
import { CreateDiscordNotificationWorker } from './queues/discordNotification'
import { SystemProcessingWorker } from './queues/systemProcessing'

export const initMQ = ({ client }: { client: Client }) => {
  const bullMQWorkers = [CreateDiscordNotificationWorker({ client }), SystemProcessingWorker]
  bullMQWorkers.forEach((worker) => {
    worker.on('failed', (job) => {
      if (job) {
        logger.error(new Error(job.failedReason), `[BullMQ] Job: ${job.name}:${job.id} - FAILED`)
      } else {
        logger.error(
          new Error('Unknown job failed'),
          `[BullMQ] Worker: ${worker.name} UNKNOWN JOB FAILED`
        )
      }
    })
    worker.on('error', (error) => {
      logger.error(`[BullMQ] Worker: ${worker.name} - ERROR:`, error)
    })
    worker.on('active', (job) => {
      logger.info(job.data, `[BullMQ] Job: ${job.name}:${job.id} - ACTIVE`)
    })
    worker.on('completed', (job) => {
      logger.info(job.returnvalue, `[BullMQ] Job: ${job.name}:${job.id} - COMPLETED`)
    })
    worker.on('closed', () => {
      logger.info(`[BullMQ] Worker: ${worker.name} - CLOSED`)
    })
  })

  return bullMQWorkers
}
