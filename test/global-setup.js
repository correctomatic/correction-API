const initDB = require('../src/db')
const { execSync } = require('child_process')
const { setDB } = require('./db')

function initTables() {
  console.log('Running migrations...')
  execSync('npx sequelize db:migrate:undo:all --env test', { stdio: 'inherit' })
  execSync('npx sequelize db:migrate --env test', { stdio: 'inherit' })
}

const runSeeders = () => {
  console.log('Running seeders...')
  execSync('npx sequelize db:seed:all --env test', { stdio: 'inherit' })
}

global.banana = 'banana'

module.exports = async (globalConfig) => {
  console.log('Global setup')
  const db = await initDB()
  globalThis.db = db
  setDB(db)
  const { sequelize } = db
  await sequelize.authenticate()
  initTables()
}
