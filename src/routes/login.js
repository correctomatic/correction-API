'use strict'

const jwt = require('jsonwebtoken')
const env = require('../config/env')

async function routes(fastify, _options) {

  const User = fastify.db.models.User

  fastify.post('/login', async (request, reply) => {
    const { username, password } = request.body
    const user = await User.findOne({ where: { user: username } })

    if (!user || ! await user.validatePassword(password)) {
      return reply.status(401).send({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ user: user.user }, env.jwt.secretKey, { expiresIn: env.jwt.expiration })
    return { token }
  })

}

module.exports = routes
