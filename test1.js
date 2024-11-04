const dbInit = require('./src/db')
const db = dbInit()

async function main1() {

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

async function accesing_owner() {
  const foo = await db.models.User.findByPk('foo')
  console.log(foo.toJSON())
  const foo_exercise1 = await db.models.Assignment.findOne({
    where: { user: 'foo', assignment: 'exercise1' } ,
    include: ['owner']
  })
  console.log(foo_exercise1.toJSON())
  const anotherFoo = foo_exercise1.owner
  console.log(anotherFoo.toJSON())

  await foo_exercise1.getOwner()
  const anotherFoo2 = foo_exercise1.owner
  console.log(anotherFoo2.toJSON())
}

async function accesing_assignments() {
  const foo = await db.models.User.findByPk('foo', { include: ['assignments'] })
  console.log(foo.toJSON())
  const assignments = foo.assignments
  console.log(assignments.map(a => a.toJSON()))
}

async function main() {
  let valid

  const foo = await db.models.User.findByPk('foo')
  valid = await foo.validatePassword('bar')
  console.log(valid)
}

console.time('main')
main()
  .catch(console.error)
  .finally(() => {
    console.timeEnd('main')
    db.sequelize.close()
  })
