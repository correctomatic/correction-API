import {
  HELLO_SCHEMA
} from '../schemas/hello_schemas.js'

async function routes(fastify, _options) {

  fastify.get(
    '/hello',
    { schema: HELLO_SCHEMA },
    async (_request, _reply) => {
      // console.log(request.id)
      return 'Hello, world!'
    }
  )
}

export default routes
