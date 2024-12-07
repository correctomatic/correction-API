const {
  CREATE_API_KEY_SCHEMA,
  LIST_API_KEYS_SCHEMA,
  DELETE_API_KEY_SCHEMA
} = require('@schemas/api-keys_schemas')

const authenticator = require('@middleware/authenticator')
const { errorResponse } = require('@lib/requests')
const { sequelizeError } = require('@lib/errors')

async function routes(fastify, _options) {

  fastify.addHook('preHandler', authenticator('bearer'))

  // TO-DO: Allow admin to manage API keys for other users

  fastify.post(
    '/',
    { schema: CREATE_API_KEY_SCHEMA },
    async (request, reply) => {
      const user = request.user

      try {
        const apiKey = await user.createApiKey()
        reply.send({ key: apiKey.key })
      } catch (error) {
        const userError = sequelizeError(error)
        if (userError) return reply.status(400).send(errorResponse(userError))
        else return reply.status(500).send(errorResponse('Internal server error'))
      }
    })

  fastify.post(
    '/:user',
    async (request, reply) => {
      throw new Error('Not implemented')
    })

  fastify.get(
    '/',
    { schema: LIST_API_KEYS_SCHEMA },
    async (request, reply) => {
      const user = request.user

      try {
        const apiKeys = await user.getApiKeys()
        reply.send(apiKeys)
      } catch (_error) {
        reply.status(500).send(errorResponse('Failed to list API keys'))
      }
    })

  fastify.get(
    '/:user',
    async (request, reply) => {
      throw new Error('Not implemented')
    })

  fastify.delete(
    '/:id',
    { schema: DELETE_API_KEY_SCHEMA },
    async (request, reply) => {
      const { id } = request.params
      const user = request.user

      try {
        const apiKey = await user.findApiKey(id)
        if (!apiKey) return reply.status(404).send(errorResponse('API key not found'))
        await apiKey.destroy()
        reply.status(204).send()
      } catch (_error) {
        reply.status(500).send(errorResponse('Failed to revoke API key'))
      }
    })

  fastify.delete(
    '/:user/:id',
    async (request, reply) => {
      throw new Error('Not implemented')
    })
}

module.exports = routes
