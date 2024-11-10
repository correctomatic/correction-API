const { sequelize } = require('./sequelize_instance')

module.exports = async () => {
  await db.sequelize.close()  // Close the connection after all test suites
}
