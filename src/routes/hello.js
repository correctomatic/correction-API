const { HELLO_SCHEMA } = require('../schemas/hello_schemas')

async function routes(fastify, _options) {

  fastify.get(
    '/hello',
    { schema: HELLO_SCHEMA },
    async (_request, _reply) => {
      return 'Hello, world!'
    }
  )
}

module.exports = routes
