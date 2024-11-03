async function routes(fastify, _options) {

  fastify.get(
    '/test',
    async (_request, _reply) => {

      return 'Foo!'
    }
  )
}

module.exports = routes
