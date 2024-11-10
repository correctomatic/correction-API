// const { sequelize } = require('./sequelize_instance')

const initDB = require('@db')

module.exports = async () => {
  global.db = await initDB()
  await db.sequelize.authenticate()
  await db.sequelize.sync({ force: true })  // Creates the tables (drops and recreates them)
}
