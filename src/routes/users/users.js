const logger = require('../../logger')
const authenticator = require('@middleware/authenticator.js')
const UserPolicy = require('@policies/user_policy.js')

const { validateQueryParams, errorResponse, setLimitAndOffset } = require('@lib/requests')

const {
  GET_USERS_SCHEMA,
} = require('@schemas/user_schemas.js')

async function routes(fastify, _options) {

  const User = fastify.db.sequelize.models.User

  fastify.addHook('preHandler', authenticator())

  fastify.get(
    '/',
    {
      schema: GET_USERS_SCHEMA,
      preHandler: [validateQueryParams(GET_USERS_SCHEMA), setLimitAndOffset]
    },
    async (request, reply) => {

      try {
        const { limit, offset } = request

        const userPolicy = new UserPolicy(request.user)
        if (!userPolicy.can('list')) {
          return reply.code(403).send(errorResponse('You are not authorized to list users'))
        }

        const users = await User.findAll({ limit, offset })
        reply.send(users)
      } catch (error) {
        logger.error(error)
        return reply.status(500).send(errorResponse('Internal server error'))
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
