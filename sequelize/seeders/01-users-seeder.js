'use strict'

const path = require('path')
const bcrypt = require('bcrypt')
const parseCSV = require('./lib/read_csv')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const usersData = await parseCSV(path.resolve(__dirname,'./data/users.csv'))

    // Transform data as needed (e.g., hashing passwords for user data)
    const users = await Promise.all(usersData.map(async (row) => ({
      username: row.username,
      roles: row.roles ? row.roles?.split(';') : null,
      password: await bcrypt.hash(row.password, 10),
      createdAt: row.createdAt || new Date(),
      updatedAt: row.updatedAt || new Date()
    })))

    await queryInterface.bulkInsert('Users', users, {})
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
