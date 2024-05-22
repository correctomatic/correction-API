import env from './config/env.js'
import { join } from 'node:path'

import Fastify from 'fastify'
import AutoLoad from '@fastify/autoload'
import fastifyCors from '@fastify/cors'
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"
import multipart from '@fastify/multipart'
import { swaggerOptions, swaggerUiOptions } from './swagger.js'

import logger from './logger.js'

const PORT = env.PORT

const fastify = Fastify({
  logger
})

fastify.register(fastifySwagger, swaggerOptions)
fastify.register(fastifySwaggerUi, swaggerUiOptions)
fastify.register(fastifyCors, { origin: '*' })
fastify.register(multipart)

// Run the server!
try {
  fastify.register(AutoLoad, {
    dir: join(import.meta.dirname, 'routes'),
  })

  fastify.listen({ port: PORT, host: '0.0.0.0' })

  // Export documentation to yml. Uncomment this and the fs import at the
  // top of the file to generate the yaml
  // await fastify.listen({ port: PORT, host: '0.0.0.0' })
  // const yaml = fastify.swagger({ yaml: true })
  // fs.writeFileSync('./swagger.yml', yaml)

} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}

