const {
  CREATE_API_KEY_SCHEMA,
  LIST_API_KEYS_SCHEMA,
  DELETE_API_KEY_SCHEMA
} = require('../schemas/api-keys_schemas')

const authenticator = require('../middleware/authenticator')
const { errorResponse } = require('../lib/requests')
const { sequelizeError } = require('../lib/errors')

async function routes(fastify, _options) {

  const ApiKey = fastify.db.sequelize.models.ApiKey

  fastify.addHook('preHandler', authenticator('bearer'))

  fastify.post(
    '/api-keys',
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

  fastify.get(
    '/api-keys',
    { schema: LIST_API_KEYS_SCHEMA },
    async (request, reply) => {
      const user = request.user

      try {
        const apiKeys = await user.getApiKeys()
        reply.send(apiKeys)
      } catch(_error) {
        reply.status(500).send({ error: 'Failed to list API keys' })
      }
    })

  fastify.delete(
    '/api-keys/:id',
    { schema: DELETE_API_KEY_SCHEMA },
    async (request, reply) => {
      const { id } = request.params
      const user = request.user

      try {
        const apiKey = await user.findApiKey(id)
        if (!apiKey) return reply.status(404).send({ error: 'API key not found' })
        await apiKey.destroy()
        reply.status(204).send()
      } catch(_error) {
        reply.status(500).send({ error: 'Failed to revoke API key' })
      }
    })

}

module.exports = routes
