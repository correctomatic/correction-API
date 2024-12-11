import jwt from 'jsonwebtoken'
import env from '#env'
import logger from '../logger.js'
import { errorResponse } from '#lib/requests.js'

async function bearerAuthenticate(request) {
  const token = request.headers['authorization']?.split(' ')[1]
  if (!token) return null

  const db = request.server.db

  try {
    const { user } = jwt.verify(token, env.jwt.secretKey)
    const theUser = await db.User.findByPk(user)
    return theUser || null
  } catch (_error) {
    return null
  }
}

async function apiKeyAuthenticate(request) {
  const apiKey = request.headers['x-api-key']
  if (!apiKey) return null

  const db = request.server.db

  try {
    const user = await db.User.findByApiKey(apiKey)
    return user || null
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

async function getAuthenticatedUser(request, functions) {
  for (const authFunction of functions) {
    // We want to run the auth methods in order
    /* eslint-disable no-await-in-loop */
    const user = await authFunction(request)
    if (user) return user
  }

  return null
}

function authenticator(...methods) {
  return async function (request, reply) {

    const authFunctions = getAuthFunctionsByNames(methods)
    if (authFunctions.length === 0) {
      logger.error('No valid authentication methods provided: ' + methods)
      return reply.status(500).send(errorResponse('Internal server error'))
    }

    const user = await getAuthenticatedUser(request, authFunctions)

    if (user) {
      // The race condition is not a problem here, because the request object is unique for each request
      /* eslint-disable require-atomic-updates */
      request.user = user
      return
    }

    // Send unauthorized response if no method succeeds
    return reply.status(401).send(errorResponse('Unauthorized'))
  }
}

export default authenticator
