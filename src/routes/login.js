'use strict'

const jwt = require('jsonwebtoken')
const env = require('../config/env')
const logger = require('../logger')

const { LOGIN_SCHEMA } = require('@schemas/login_schema')
const errorResponse = require('@lib/requests').errorResponse

async function routes(fastify, _options) {

  const User = fastify.db.models.User

  fastify.post(
    '/login',
    { schema: LOGIN_SCHEMA },
    async (request, reply) => {
      try {
        const { user, password } = request.body
        const userInstance = await User.findOne({ where: { username: user } })

        if (!userInstance || ! await userInstance.validatePassword(password)) {
          return reply.status(401).send(errorResponse('Invalid credentials'))
        }

        const token = jwt.sign({ user: userInstance.username }, env.jwt.secretKey, { expiresIn: env.jwt.expiration })
        return { token }
      } catch (error) {
        logger.error(error)
        return reply.status(500).send(errorResponse('Internal server error'))
      }
    })

}

module.exports = routes
