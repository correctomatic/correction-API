const jwt = require('jsonwebtoken')
const env = require('../config/env')

async function authenticate(request, reply) {
  const token = request.headers['authorization']?.split(' ')[1]
  if (!token) {
    return reply.status(401).send({ message: 'Unauthorized' })
  }

  try {
    const decoded = jwt.verify(token, env.jwt.secretKey)
    request.user = decoded
  } catch (error) {
    return reply.status(401).send({ message: 'Unauthorized' })
  }
}

module.exports = authenticate
