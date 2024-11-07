const env = require('./config/env')
const { join } = require('path')

const Fastify = require('fastify')
const AutoLoad = require('@fastify/autoload')
const fastifyCors = require('@fastify/cors')
const fastifySwagger = require('@fastify/swagger')
const fastifySwaggerUi = require('@fastify/swagger-ui')
const multipart = require('@fastify/multipart')
const { swaggerOptions, swaggerUiOptions } = require('./swagger')

const logger = require('./logger')
const dbConnector = require('./plugins/sequelize')

const PORT = env.PORT

const fastify = Fastify({
  logger,
  ajv: {
    customOptions: { allErrors: true },
    plugins: [
      [require('ajv-errors')]
    ]
  }
})

fastify.register(fastifySwagger, swaggerOptions)
fastify.register(fastifySwaggerUi, swaggerUiOptions)
fastify.register(fastifyCors, { origin: '*' })
fastify.register(multipart)

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

