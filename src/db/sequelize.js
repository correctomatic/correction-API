import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import fp from 'fastify-plugin'
import { Sequelize } from 'sequelize'

import * as models from './models/index.js' // Import all models as an object

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function readModels(sequelize) {

  const modelsDir = path.join(__dirname, 'models')

  const modelFiles = fs.readdirSync(modelsDir).filter((file) => file.endsWith('.js'))

  await Promise.all(
    modelFiles.map(async (file) => {
      const { default: model } = await import(path.join(modelsDir, file))
      model(sequelize, Sequelize.DataTypes) // Inicializa el modelo con Sequelize
    })
  )


  // Loop through all exports in models/index.js
  Object.values(models).forEach((model) => {
    // Initialize model with Sequelize if it has an init function
    if (typeof model.init === 'function') {
      model.init(sequelize)
    }
  })

  // Relaciona los modelos si es necesario
  Object.values(sequelize.models).forEach((model) => {
    if (typeof model.associate === 'function') {
      model.associate(sequelize.models)
    }
  })

}

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

  await readModels(sequelize)

  fastify.decorate('Sequelize', Sequelize)
  fastify.decorate('sequelize', sequelize)

  fastify.addHook('onClose', async (_instance, done) => {
    await sequelize.close()
    done()
  })
}

export default fp(dbConnector)
