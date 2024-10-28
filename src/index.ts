import env from './config/env'
import { join } from 'node:path'

import Fastify, { FastifyInstance } from 'fastify'
import AutoLoad from '@fastify/autoload'
import fastifyCors, { FastifyCorsOptions } from '@fastify/cors'
import fastifySwagger, { FastifySwaggerOptions } from "@fastify/swagger"
import fastifySwaggerUi, { FastifySwaggerUiOptions } from "@fastify/swagger-ui"
import multipart from '@fastify/multipart'
// import { swaggerOptions, swaggerUiOptions } from './swagger.js'

import logger from './logger.js'
import { scriptDir } from './lib/utils.js'

const PORT: number = env.PORT as number

const fastify: FastifyInstance = Fastify({
  logger
})

// fastify.register(fastifySwagger, swaggerOptions as FastifySwaggerOptions)
// fastify.register(fastifySwaggerUi, swaggerUiOptions as FastifySwaggerUiOptions)
fastify.register(fastifyCors, { origin: '*' } as FastifyCorsOptions)
fastify.register(multipart)

// Run the server!
try {
  const currentDir: string = scriptDir(import.meta)
  fastify.register(AutoLoad, {
    dir: join(currentDir, 'routes'),
  })

  fastify.listen({ port: PORT, host: '0.0.0.0' })

} catch (err: unknown) {
  fastify.log.error(err)
  process.exit(1)
}
