import { HELLO_SCHEMA } from '#schemas/hello_schemas.js'

export default async function routes(fastify, _options) {

  fastify.get(
    '/hello',
    { schema: HELLO_SCHEMA },
    async (_request, _reply) => {
      return 'Hello, world!'
    }
  )
}
