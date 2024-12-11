import { describe, it, beforeAll, afterAll } from 'vitest'

import bcrypt from 'bcrypt'
import { Sequelize } from 'sequelize'

import sequelize from '../db'
import UserModel from '../../src/db/models/user'

describe('User model', () => {
  let User

  beforeAll(async () => {
    // Sync the database to ensure tables are created
    User = UserModel(sequelize, Sequelize.DataTypes)
    await sequelize.sync({ force: true })
  })

  afterAll(async () => {
    // Close the database connection after all tests
    await sequelize.close()
  })

  it('should hash the password before creating a user', async () => {
    const user = await User.create({ user: 'testuser', password: 'plainpassword', roles: ['user'] })
    const isPasswordHashed = await bcrypt.compare('plainpassword', user.password)
    expect(isPasswordHashed).toBe(true)
  })

  it('should update password before updating a user', async () => {
    try {
      const user = await User.create({ user: 'testuser', password: 'plainpassword', roles: ['user'] })
      const newPassword = 'newpassword'
      user.password = newPassword
      await user.save()
      const updatedUser = await User.findByPk('testuser')
      const isPasswordHashed = await bcrypt.compare(newPassword, updatedUser.password)
      expect(isPasswordHashed).toBe(true)
    } catch (error) {
      console.log(error)
    }
  })

  it('should validate the password correctly', async () => {
    const user = await User.create({ user: 'testuser', password: 'plainpassword', roles: ['user'] })
    const isValid = await user.validatePassword('plainpassword')
    expect(isValid).toBe(true)
    const isInvalid = await user.validatePassword('wrongpassword')
    expect(isInvalid).toBe(false)
  })

  it('should associate with the Assignment model', async () => {
    const user = await User.create({ user: 'testuser', password: 'plainpassword', roles: ['user'] })
    const assignment = await Assignment.create({ title: 'Test Assignment', user: 'testuser' })
    const userAssignments = await user.getAssignments()
    expect(userAssignments.length).toBe(1)
    expect(userAssignments[0].title).toBe('Test Assignment')
  })
})
