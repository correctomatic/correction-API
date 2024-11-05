const logger = require('../logger')
const { putInPendingQueue } = require('./bullmq')
const {ParamsError} = require('./errors')

// Params must be in the format VAR_NAME=something
const paramRegex = /^[a-zA-Z_][a-zA-Z0-9_]*=.+$/
const isValidParam = (param) => paramRegex.test(param)
function validateParams(params) {
  for (const param of params) {
    if (!isValidParam(param)) throw new ParamsError(`Invalid param format: ${param}`)
  }
}

async function createCorrectionJob(work_id, image, uploadedFile, callback, params) {

  validateParams(params)

  const message = {
    work_id,
    image,
    file: uploadedFile,
    callback,
    params
  }

  logger.debug('Enqueuing work for grading:' + JSON.stringify(message))
  await putInPendingQueue(message)
  logger.info('Work enqueued for grading:' + JSON.stringify(message))
}

module.exports = {
  ParamsError,
  createCorrectionJob
}
