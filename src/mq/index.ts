import logger from '../utils/logger'
import { FactionReportWorker } from './queues/factionReport'

const Workers = [FactionReportWorker]

export const initMQ = () => {
  Workers.forEach((worker) => {
    worker.on('failed', (job) => {
      if (job) {
        logger.error(new Error(job.failedReason), `Job: ${job.name}:${job.id} - FAILED`)
      } else {
        logger.error(new Error('Unknown job failed'), `Worker: ${worker.name} UNKNOWN JOB FAILED`)
      }
    })
    worker.on('error', (error) => {
      logger.error(`Worker: ${worker.name} - ERROR:`, error)
    })
    worker.on('active', (job) => {
      logger.info(job.data, `Job: ${job.name}:${job.id} - ACTIVE`)
    })
    worker.on('completed', (job) => {
      logger.info(job.returnvalue, `Job: ${job.name}:${job.id} - COMPLETED`)
    })
  })
}
