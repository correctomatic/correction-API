const dbInit = require('./src/db')
const db = dbInit()

async function main() {


  const user1 = await db.models.User.build({
    user: 'user1',
    roles: ['admin'],
    password: 'password',
  })
  console.log(user1.toJSON())

}

main()
