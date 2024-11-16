module.exports = async () => {
  await db.sequelize.close()  // Close the connection after all test suites
}
