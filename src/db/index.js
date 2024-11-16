'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const env = require(__dirname + '/../config/env.js')
const appConfig = require(__dirname + '/../../sequelize/config.js')[env.ENVIRONMENT]

function initSequelize(extraConfig) {
  const db = {}
  let sequelize
  const config = {
    ...appConfig,
    ...extraConfig
  }

  sequelize = new Sequelize(config.database, config.username, config.password, config)

  const modelsDirectory = path.join(__dirname, 'models')
  fs
    .readdirSync(modelsDirectory)
    .filter(file => {
      return (
        file.indexOf('.') !== 0 &&
        file !== basename &&
        file.slice(-3) === '.js' &&
        file.indexOf('.test.js') === -1
      )
    })
    .forEach(file => {
      const model = require(path.join(modelsDirectory, file))(sequelize, Sequelize.DataTypes)
      db[model.name] = model
    })

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

module.exports = initSequelize
