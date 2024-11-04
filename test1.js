const dbInit = require('./src/db')
const db = dbInit()

async function main() {

  // Eliminar usuarios cuyo nombre comienza con "user"
  const deletedCount = await db.models.User.destroy({
    where: {
      user: {
        [db.Sequelize.Op.startsWith]: 'user'
      }
    }
  })


  const user1 = await db.models.User.build({
    user: 'user1',
    roles: ['admin'],
    password: 'password',
  })
  await user1.save()
  // console.log(user1.toJSON())


  const assignment1 = await db.models.Assignment.build({
    user: user1.user,
    assignment: 'assignment1',
    image: 'image1',
  })
  // console.log(assignment1.toJSON())
  await assignment1.save()

  const assignment2 = await db.models.Assignment.build({
    user: user1,
    assignment: 'assignment1',
    image: 'image1',
  })
  // console.log(assignment2.toJSON())



}

console.time('main')
main()
  .catch(console.error)
  .finally(() => {
    console.timeEnd('main')
    db.sequelize.close()
  })
