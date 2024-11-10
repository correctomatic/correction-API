'use strict'
const bcrypt = require('bcrypt')
const { sequelize, DataTypes } = require('../sequelize_instance')

// const realPath = require.resolve('@models/assignment')
// console.log('Real path of the module:', realPath)

// const UserModel = require('@models/user')
// const AssignmentModel = require('@models/assignment')
const UserModel = require("../../src/db/models/user")
const AssignmentModel = require("../../src/db/models/user")

describe('User Model', () => {
  let User
  let Assignment

  beforeAll(async () => {
    // Initialize models
    User = UserModel(sequelize, DataTypes)
    Assignment = AssignmentModel(sequelize, DataTypes)
    User.associate({ Assignment })
  })

  afterAll(async () => {
    await sequelize.close()
  })

  describe.only('Test', () => {
    it('BANANA!!', async () => {
      try {
        // const user = await User.create({user: 'testUser', password: 'plainPassword', roles: ['assignments']})
        // expect(User.modelName).toBe('User')
        expect(2).toBe(2)
      }catch(e){
        console.log(e)
      }
    })
  })

  describe('Hooks', () => {
    it('should hash password before creating a user', async () => {
      const user = await User.create({ user: 'testUser', password: 'plainPassword', roles: ['assignments'] })
      expect(await bcrypt.compare('plainPassword', user.password)).toBe(true)
    })

    it('should hash password before updating if password has changed', async () => {
      const user = await User.create({ user: 'updateUser', password: 'initialPassword', roles: ['assignments'] })
      user.password = 'newPassword'
      await user.save()
      expect(await bcrypt.compare('newPassword', user.password)).toBe(true)
    })
  })

  describe('Password Validation', () => {
    it('should validate password correctly', async () => {
      const password = 'correctPassword'
      const user = await User.create({ user: 'passwordUser', password, roles: ['assignments'] })
      expect(await user.validatePassword(password)).toBe(true)
      expect(await user.validatePassword('wrongPassword')).toBe(false)
    })
  })

  describe('Associations', () => {
    it('should have association with Assignment model', async () => {
      expect(User.associations.assignments).toBeDefined()
      expect(User.associations.assignments.foreignKey).toBe('user')
    })
  })

  describe('Validation', () => {
    it('should not allow empty password', async () => {
      try {
        await User.create({ user: 'emptyPasswordUser', password: '', roles: ['assignments'] })
      } catch (error) {
        expect(error.errors[0].message).toBe('Password cannot be empty')
      }
    })
  })
})
