const jwt = require('jsonwebtoken')

const env = require('../config/env')
const logger = require('../logger')

const { errorResponse } = require('../lib/requests')

async function bearerAuthenticate(request) {
  const token = request.headers['authorization']?.split(' ')[1]
  if (!token) return null

  try {
    const { user } = jwt.verify(token, env.jwt.secretKey)
    return user
  } catch (error) {
    return null
  }
}

async function apiKeyAuthenticate(request) {
  const apiKey = request.headers['x-api-key']
  if (!apiKey) return null

  const fastifyInstance = request.server
  const db = fastifyInstance.db


  try {
    const user = await db.User.findOne({ where: { apiKey } })
    return user.user || null
  } catch (error) {
    logger.error(`Error searching the API key in the database: ${error.message}`)
    return null
  }
}

const AUTHENTICATE_METHODS = {
  bearer: bearerAuthenticate,
  apiKey: apiKeyAuthenticate
}

function getAuthFunctionsByNames(names) {
  if (!names || names.length === 0) return Object.values(AUTHENTICATE_METHODS)

  return names
    .filter(name => AUTHENTICATE_METHODS[name])
    .map(name => AUTHENTICATE_METHODS[name])
}


function authenticator(...methods) {
  return async function (request, reply) {

    const authFunctions = getAuthFunctionsByNames(methods)

    for (const authFunction of authFunctions) {
      const user = await authFunction(request)
      if (user) {
        request.user = user
        return
      }
    }

    // Send unauthorized response if no method succeeds
    return reply.status(401).send(errorResponse('Unauthorized'))
  }
}

module.exports = authenticator
