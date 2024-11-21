const env = require('./config/env')
const { join } = require('path')
require('module-alias/register')

const Fastify = require('fastify')
const AutoLoad = require('@fastify/autoload')
const fastifyCors = require('@fastify/cors')
const fastifySwagger = require('@fastify/swagger')
const fastifySwaggerUi = require('@fastify/swagger-ui')
const multipart = require('@fastify/multipart')
const { swaggerOptions, swaggerUiOptions } = require('./swagger')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { pipeline } = require('stream/promises')

const logger = require('./logger')
const dbConnector = require('./plugins/sequelize')

const PORT = env.PORT

const fastify = Fastify({
  logger,
  ajv: {
    customOptions: { allErrors: true, strict: false, removeAdditional: false, },
    plugins: [
      [require('ajv-errors')]
    ]
  }
})

// This function is called for each file in the multipart form, will write
// the file to a temporary location so it don't be stored in memory
// The name of the file will be available in the request as `file`
async function onFile(part) {
  const req = this // you have access to original request via `this`

  const tempFilename = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}-${part.filename}`
  const tempFilePath = path.join(os.tmpdir(), tempFilename)

  req.file = tempFilePath
  await pipeline(part.file, fs.createWriteStream(tempFilePath))
}

fastify.register(fastifySwagger, swaggerOptions)
fastify.register(fastifySwaggerUi, swaggerUiOptions)
fastify.register(fastifyCors, { origin: '*' })
fastify.register(multipart, { attachFieldsToBody: true, onFile })

// Run the server!
try {

  fastify.setErrorHandler((error, _request, reply) => {
    fastify.log.error(error)
    reply.status(400).send({
      success: false,
      message: error.message || 'An unexpected error occurred'
    })
  })

  fastify.register(dbConnector, { logging: (msg) => logger.info(msg) })

  // Routes MUST be loaded after the dbConnector plugin
  fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
  })

  // Uncomment this to print the routes to the console
  // fastify.ready(err => {
  //   if (err) throw err
  //   console.log(fastify.printRoutes())
  // })

  const startServer = async () => {
    await fastify.listen({ port: PORT, host: '0.0.0.0' })
    fastify.log.info(`Server running on port ${PORT}`)
  }

  // Graceful shutdown handling
  const shutdown = async () => {
    try {
      fastify.log.info('Shutdown signal received. Closing server...')
      await fastify.close()
      fastify.log.info('Server closed.')
      process.exit(0)
    } catch (err) {
      fastify.log.error('Error during shutdown:', err)
      process.exit(1)
    }
  }

  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)

  startServer()

  // Export documentation to yml. Uncomment this and the fs import at the
  // top of the file to generate the yaml
  // await fastify.listen({ port: PORT, host: '0.0.0.0' })
  // const yaml = fastify.swagger({ yaml: true })
  // fs.writeFileSync('./swagger.yml', yaml)

} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}

