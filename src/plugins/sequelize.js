import fp from 'fastify-plugin'
import initDB from '../db/index.js'

async function dbConnector(fastify, options) {
  const db = await initDB(options)

  await db.sequelize.authenticate()
  fastify.log.info('Database connection has been established successfully.')

  fastify.decorate('Sequelize', db.Sequelize)
  fastify.decorate('sequelize', db.sequelize)
  fastify.decorate('db', db)

  fastify.addHook('onClose', async (_instance, done) => {
    await db.sequelize.close()
    done()
  })
}

export default fp(dbConnector)
