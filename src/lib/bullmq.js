import { Queue } from 'bullmq'
import env from '../config/env.js'
import logger from '../logger.js'

const { QUEUE_NAME, QUEUE_CONFIG } = env.bullMQ
const queue = new Queue(QUEUE_NAME,QUEUE_CONFIG)

async function putInPendingQueue(message) {
  logger.info('Putting message in pending queue')
  return queue.add('pending correction', message)
}

export {
  putInPendingQueue
}
