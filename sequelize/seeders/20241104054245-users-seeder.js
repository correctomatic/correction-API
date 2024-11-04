'use strict'

const bcrypt = require('bcrypt')
const parseCSV = require('./read_csv')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Load data from CSV file
    const usersData = await parseCSV('users.csv')

    // Transform data as needed (e.g., hashing passwords for user data)
    const users = await Promise.all(usersData.map(async (row) => ({
      user: row.user,
      roles: row.roles ? row.roles?.split(';') : [],
      password: await bcrypt.hash(row.password, 10),
      createdAt: row.createdAt || new Date(),
      updatedAt: row.updatedAt || new Date()
    })))

    // Bulk insert transformed data into the database
    await queryInterface.bulkInsert('Users', users, {})
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
