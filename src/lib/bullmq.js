const { Queue } = require('bullmq')
const env = require('../config/env')
const logger = require('../logger')

const { QUEUE_NAME, QUEUE_CONFIG } = env.bullMQ
const queue = new Queue(QUEUE_NAME,QUEUE_CONFIG)

async function putInPendingQueue(job) {
  const name = `Correction${job.work_id ? ' ' + job.work_id : ''}`
  logger.info(`Putting job in pending queue. Work id: ${job.work_id}`)
  return queue.add(name, job)
}

module.exports = {
  putInPendingQueue
}
