const initDB = require('@db')
const { execSync } = require('child_process')

const initTables = () => {
  console.log('Running migrations...')
  execSync('npx sequelize db:migrate:undo:all --env test', { stdio: 'inherit' })
  execSync('npx sequelize db:migrate --env test', { stdio: 'inherit' })
}

const runSeeders = () => {
  console.log('Running seeders...')
  execSync('npx sequelize db:seed:all --env test', { stdio: 'inherit' })
}

module.exports = async () => {
  global.db = await initDB()
  const { sequelize } = db
  await sequelize.authenticate()
  initTables()
}
