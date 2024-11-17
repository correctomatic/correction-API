const initDB = require('./db/index.js')
const db = initDB()

async function getUser(user) {
  return await db.models.User.findOne({ where: { user } })
}

async function createUser(user, password, roles) {
  await db.models.User.create({
    user,
    roles: Array.from(roles),
    password,
  })
  console.info(`User '${user}' has been created with roles: ${roles.join(',')}`)
}

async function performCreation(user, password, roles) {
  try {
    await db.sequelize.authenticate()
    console.info('Database connection has been established successfully.')

    const existingUser = await getUser(user)
    if (existingUser) {
      console.info(`User '${user}' already exists with roles: ${existingUser.roles.join(',')}`)
      return
    }

    await createUser(user, password, roles)
  } catch (error) {
    console.error('An error occurred:', error)
    process.exit(1)
  } finally {
    await db.sequelize.close()
    console.info('Database connection closed.')
  }
}

const args = process.argv.slice(2) // Skip the first two arguments (node and script path)
if (args.length < 2) {
  console.error('Usage: script.js <username> <password> [role1,role2,...]')
  process.exit(1)
}

const [user, password, rolesArg] = args
const roles = rolesArg?.split(',').map(role => role.trim())

console.info(`Processing user ${user} with roles: ${roles?.join(',') || 'none'}`)
performCreation(user, password, roles)
