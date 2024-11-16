async function main() {
  const initDB = require('./src/db/index.js')
  const db = initDB({})

  await db.sequelize.authenticate()


  const { Assignment } = db.models
  const assignment = await Assignment.findOne({ where: {
    user: 'user', assignment: 'full_params'
  }})
  console.log(assignment)

  await db.sequelize.close()
}

main()
