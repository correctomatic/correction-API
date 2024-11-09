const {
  CREATE_API_KEY_SCHEMA,
  LIST_API_KEYS_SCHEMA,
  DELETE_API_KEY_SCHEMA
} = require('../schemas/api_keys_schemas')

async function routes(fastify, _options) {

  const ApiKey = fastify.db.sequelize.models.ApiKey

  fastify.post(
    '/api-keys',
    { schema: CREATE_API_KEY_SCHEMA },
    async (request, reply) => {
      const { userId } = request.body

      try {
        const apiKey = await ApiKey.create({ userId })
        reply.send({ key: apiKey.key })
      } catch (error) {
        reply.status(500).send({ error: 'Failed to generate API key' })
      }
    })

  fastify.get(
    '/api-keys',
    { schema: LIST_API_KEYS_SCHEMA },
    async (request, reply) => {
      const { userId } = request.query

      try {
        const apiKeys = await ApiKey.findAll({ where: { userId } })
        reply.send(apiKeys)
      } catch (error) {
        reply.status(500).send({ error: 'Failed to list API keys' })
      }
    })

  fastify.delete(
    '/api-keys/:id',
    { schema: DELETE_API_KEY_SCHEMA },
    async (request, reply) => {
      const { id } = request.params

      try {
        const apiKey = await ApiKey.findByPk(id)
        if (!apiKey) {
          return reply.status(404).send({ error: 'API key not found' })
        }
        apiKey.revokedAt = new Date()
        await apiKey.save()
        reply.send({ message: 'API key revoked' })
      } catch (error) {
        reply.status(500).send({ error: 'Failed to revoke API key' })
      }
    })

}

module.exports = routes
