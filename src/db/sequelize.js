import fp from 'fastify-plugin'
import { Sequelize } from 'sequelize'

async function dbConnector(fastify, options) {
  const sequelize = new Sequelize(
    {
      database: options.database,
      username: options.username,
      password: options.password,
      host: options.host,
      dialect: options.dialect,
    }
  )

  await sequelize.authenticate()
  fastify.log.info('Database connection has been established successfully.')

  fastify.decorate('sequelize', sequelize)

  fastify.addHook('onClose', async (_instance, done) => {
    await sequelize.close()
    done()
  })
}

export default fp(dbConnector)
