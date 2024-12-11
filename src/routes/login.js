'use strict'

import jwt from 'jsonwebtoken'
import env from '../config/env.js'
import logger from '../logger.js'
import { LOGIN_SCHEMA } from '#schemas/login_schema.js'
import { errorResponse } from '#lib/requests.js'

export default async function routes(fastify, _options) {

  const User = fastify.db.models.User

  fastify.post(
    '/login',
    { schema: LOGIN_SCHEMA },
    async (request, reply) => {
      try {
        const { user, password } = request.body
        const userInstance = await User.scope('withPassword').findOne({ where: { username: user } })

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
