const logger = require('../logger')
const { putInPendingQueue } = require('./bullmq')
const {ParamsError} = require('./errors')

// Docker expects environment variables as an array of strings in the form 'KEY=VALUE'
function paramsToArray(params) {
  return Object.entries(params).map(([key, value]) => `${key}=${value}`)
}

async function createCorrectionJob(work_id, image, uploadedFile, callback, params) {

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

module.exports = {
  ParamsError,
  createCorrectionJob
}
