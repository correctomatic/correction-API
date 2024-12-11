import fastify from './server.js'
import env from './config/env.js'
const PORT = env.PORT

// Run the server!
try {
  fastify.setErrorHandler((error, _request, reply) => {
    fastify.log.error(error)
    reply.status(400).send({
      success: false,
      message: error.message || 'An unexpected error occurred'
    })
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
