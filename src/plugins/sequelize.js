const fp = require('fastify-plugin')
const initDB = require('../db/index.js') // Import all models as an object

async function dbConnector(fastify, options) {
  const db = initDB(options)
  fastify.log.info('Database connection has been established successfully.')

  fastify.decorate('Sequelize', db.Sequelize)
  fastify.decorate('sequelize', db.sequelize)
  fastify.decorate('db', db)

  fastify.addHook('onClose', async (_instance, done) => {
    await db.sequelize.close()
    done()
  })
}

module.exports = fp(dbConnector)