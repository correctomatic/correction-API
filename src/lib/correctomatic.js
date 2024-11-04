const logger = require('../logger')
const { putInPendingQueue } = require('./bullmq')

class ParamsError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ParamsError'
  }
}

function image(name, tag) { return `${name}:${tag ?? 'latest'}` }

// Params must be in the format VAR_NAME=something
const paramRegex = /^[a-zA-Z_][a-zA-Z0-9_]*=.+$/
const isValidParam = (param) => paramRegex.test(param)
function validateParams(params) {
  for (const param of params) {
    if (!isValidParam(param)) throw new ParamsError(`Invalid param format: ${param}`)
  }
}

async function createCorrectionJob(work_id, assignment_id, uploadedFile, callback, params) {

  validateParams(params)

  // TODO: need a list of exercises / images
  // At the moment we use assignment_id, but this is a security risk
  // const containerImage = image('correction-test-1')
  const containerImage = image(assignment_id)
  logger.debug('Container image for grading:' + containerImage)

  // Put the mensage in the queue
  const message = {
    work_id,
    image: containerImage,
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
