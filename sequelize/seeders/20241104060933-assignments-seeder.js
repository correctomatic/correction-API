'use strict'

const bcrypt = require('bcrypt')
const parseCSV = require('./read_csv')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Load data from CSV file
    const usersData = await parseCSV('assignments.csv')

    // Transform data as needed (e.g., hashing passwords for user data)
    const users = await Promise.all(usersData.map(async (row) => ({
      userId: row.userId,
      assignment: row.assignment,
      image: row.image,
      params: row.params ? row.params.split(';') : [],
      user_params: row.user_params || [],
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
