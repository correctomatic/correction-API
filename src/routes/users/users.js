const logger = require('../../logger')


const { errorResponse } = require('../../lib/requests')

async function routes(fastify, _options) {
  const { User } = fastify.db.models

  fastify.post('/', async (request, reply) => {
    try {
      const user = await User.create(request.body)
      reply.code(201).send(user)
    } catch (error) {
      logger.error(error)
      errorResponse(reply, error)
    }
  })

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
