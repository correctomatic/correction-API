const initDB = require('./db/index.js')

async function createUser(user, password, roles) {
  initDB()
  const db = initDB()

  await db.sequelize.authenticate()
  console.info('Database connection has been established successfully.')
  const userInstance = await db.models.User.create({
    user: user,
    roles: Array.from(roles),
    password: password
  })

  await db.sequelize.close()
}

const args = process.argv.slice(2) // Skip the first two arguments (node and script path)
if (args.length < 2) {
  console.error('Usage: script.js <username> <password> [role1,role2,...]')
  process.exit(1)
}

const [user, password, rolesArg] = args
const roles = rolesArg?.split(',').map(role => role.trim())

console.info(`Creating user ${user} with roles: ${roles?.join(',') || 'none'}`)
createUser(user, password, roles)
