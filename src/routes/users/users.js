const logger = require('../../logger')
const authenticator = require('../../middleware/authenticator.js')

const { errorResponse } = require('@lib/requests')

const {
  GET_USERS_SCHEMA,
} = require('@schemas/user_schemas.js')

async function routes(fastify, _options) {

  const User = fastify.db.sequelize.models.User

  fastify.addHook('preHandler', authenticator())

  fastify.get(
    '/',
    { schema: GET_USERS_SCHEMA },
    async (_request, reply) => {

      // TO-DO: remember to validate that there are no unexpected query parameters
      // TO-DO: admin only
      try {
        const users = await User.findAll()
        reply.send(users)
      } catch (error) {
        logger.error(error)
        errorResponse(reply, error)
      }
    })

  fastify.post(
    '/',
    async (request, reply) => {
      try {
        const user = await User.create(request.body)
        reply.code(201).send(user)
      } catch (error) {
        logger.error(error)
        errorResponse(reply, error)
      }
    })

  // Set own password
  fastify.put('/set_password', async (request, reply) => {
    try {
      const user = await User.findByPk(request.params.username)
      if (!user) {
        return reply.code(404).send({ message: 'User not found' })
      }
      await user.update(request.body)
      reply.send(user)
    } catch (error) {
      logger.error(error)
      errorResponse(reply, error)
    }
  })

  // Set another user's password
  fastify.put('/:username/set_password', async (request, reply) => {
    try {
      const user = await User.findByPk(request.params.username)
      if (!user) {
        return reply.code(404).send({ message: 'User not found' })
      }
      await user.update(request.body)
      reply.send(user)
    } catch (error) {
      logger.error(error)
      errorResponse(reply, error)
    }
  })

  // Set roles to user
  fastify.put('/:username/set_roles', async (request, reply) => {
    try {
      const user = await User.findByPk(request.params.username)
      if (!user) {
        return reply.code(404).send({ message: 'User not found' })
      }
      await user.update({ roles: request.body.roles })
      reply.send(user)
    } catch (error) {
      logger.error(error)
      errorResponse(reply, error)
    }
  })

  fastify.delete('/:username', async (request, reply) => {
    try {
      const user = await User.findByPk(request.params.username)
      if (!user) {
        return reply.code(404).send({ message: 'User not found' })
      }
      await user.destroy()
      reply.code(204).send()
    } catch (error) {
      logger.error(error)
      errorResponse(reply, error)
    }
  })
}

module.exports = routes
