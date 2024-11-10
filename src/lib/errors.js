const errorResponse = require('./requests').errorResponse
const logger = require('../logger')

class ParamsError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ParamsError'
  }
}

class ImageError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ParamsError'
  }
}

function sequelizeError(error) {
  if (error.name === 'SequelizeValidationError') {
    const messages = error.errors.map(e => `Field '${e.path}': ${e.message}`).join(', ')
    return (`Validation error(s): ${messages}`)
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return ('Duplicated assignment')
  }

  return null
}

function handleSequelizeError(error, reply, message = 'Error') {
  const userError = sequelizeError(error)
  if (userError) return reply.status(400).send(errorResponse(userError))
  else {
    logger.error(`${message}: ${JSON.stringify(error)}`)
    return reply.status(500).send(errorResponse('Internal server error'))
  }
}

module.exports = {
  ParamsError,
  ImageError,
  sequelizeError, handleSequelizeError
}
