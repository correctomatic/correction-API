const { Sequelize, DataTypes } = require('sequelize')
const config = require('../sequelize/config')

const sequelize = new Sequelize(config.test)

module.exports = { sequelize, DataTypes }
