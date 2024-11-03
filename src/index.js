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
// const dbConnector = require('./db/sequelize')

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
  const dbOpts = {
    // database: 'memory:',
    // dialect: 'sqlite',
    dialect: 'postgres',
    host: env.db.host,
    database: env.db.database,
    username: env.db.username,
    password: env.db.password,
    logging: (msg) => logger.info(msg)
  }
  // fastify.register(dbConnector, dbOpts)

  fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
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

