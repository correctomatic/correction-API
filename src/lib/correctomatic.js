import logger from '../logger.js'
import { putInPendingQueue } from './bullmq.js'

// Docker expects environment variables as an array of strings in the form 'KEY=VALUE'
function paramsToArray(params) {
  return Object.entries(params).map(([key, value]) => `${key}=${value}`)
}

export async function createCorrectionJob(work_id, image, uploadedFile, callback, params) {
  const message = {
    work_id,
    image,
    file: uploadedFile,
    callback,
    params: paramsToArray(params)
  }

  logger.debug('Enqueuing work for grading:' + JSON.stringify(message))
  await putInPendingQueue(message)
  logger.info('Work enqueued for grading:' + JSON.stringify(message))
}
