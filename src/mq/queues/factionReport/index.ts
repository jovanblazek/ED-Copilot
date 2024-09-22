import { Queue, Worker } from 'bullmq'
import logger from '../../../utils/logger'
import { Redis } from '../../../utils/redis'
import { QueueNames } from '../../constants'

export const FactionReportQueue = new Queue(QueueNames.factionReport, {
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

export const FactionReportWorker = new Worker(
  QueueNames.factionReport,
  // eslint-disable-next-line require-await, @typescript-eslint/require-await
  async (job) => {
    logger.info(job.data, 'Processing faction report job')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return job.data
  },
  {
    connection: Redis,
  }
)
