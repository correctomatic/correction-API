import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Sequelize from 'sequelize'
import env from '../config/env.js'
import appConfig from '../../sequelize/config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const basename = path.basename(__filename)
const config = appConfig[env.ENVIRONMENT]

async function initSequelize(extraConfig) {
  const db = {}
  const sequelize = new Sequelize(config.database, config.username, config.password, { ...config, ...extraConfig })

  const modelsDirectory = path.join(__dirname, 'models')
  const modelFiles = fs
    .readdirSync(modelsDirectory)
    .filter(file => {
      return (
        file.indexOf('.') !== 0 &&
        file !== basename &&
        file.slice(-3) === '.js' &&
        file.indexOf('.test.js') === -1
      )
    })

  try {
    const modelPromises = modelFiles.map(async file => {
      const init = (await import(path.join(modelsDirectory, file))).default
      const model = init(sequelize, Sequelize.DataTypes)
      db[model.name] = model
    })
    await Promise.all(modelPromises)
  } catch (error) {
    console.error('Error loading models:', error)
    throw error
  }

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db)
    }
  })

  db.models = sequelize.models
  db.sequelize = sequelize
  db.Sequelize = Sequelize

  return db
}

export default initSequelize
