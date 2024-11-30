async function routes(fastify, _options) {

  fastify.route({
    method: ['GET', 'POST'],
    url: '/',
    handler: async (_request, reply) => {
      reply.redirect('/docs')
    }
  })
}

module.exports = routes
