import { Queue } from 'bullmq'
import env from '../config/env.js'
import logger from '../logger.js'

const { QUEUE_NAME, QUEUE_CONFIG } = env.bullMQ
const queue = new Queue(QUEUE_NAME, QUEUE_CONFIG)

export async function putInPendingQueue(job) {
  const name = `Correction${job.work_id ? ' ' + job.work_id : ''}`
  logger.info(`Putting job in pending queue. Work id: ${job.work_id}`)
  return queue.add(name, job)
}
