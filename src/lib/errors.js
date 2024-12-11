import { errorResponse } from './requests.js'
import logger from '../logger.js'

export class ParamsError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ParamsError'
  }
}

export class ImageError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ParamsError'
  }
}

export function sequelizeError(error) {
  if (error.name === 'SequelizeValidationError') {
    const messages = error.errors.map(e => `Field '${e.path}': ${e.message}`).join(', ')
    return (`Validation error(s): ${messages}`)
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return ('Record already exists')
  }

  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return ('Invalid reference')
  }

  return null
}

export function handleSequelizeError(error, reply, message = 'Error') {
  const userError = sequelizeError(error)
  if (userError) return reply.status(400).send(errorResponse(userError))
  else {
    logger.error(`${message}: ${JSON.stringify(error)}`)
    return reply.status(500).send(errorResponse('Internal server error'))
  }
}
