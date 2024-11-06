'use strict'

const path = require('path')
const parseCSV = require('./lib/read_csv')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Load data from CSV file
    const assignmentsData = await parseCSV(path.resolve(__dirname,'./data/assignments.csv'))

    // Transform data as needed (e.g., hashing passwords for user data)
    const assignments = await Promise.all(assignmentsData.map(async (row) => ({
      user: row.user,
      assignment: row.assignment,
      image: row.image,
      params: row.params ? row.params.split(';') : null,
      user_params: row.user_params || null,
      createdAt: row.createdAt || new Date(),
      updatedAt: row.updatedAt || new Date()
    })))

    // Bulk insert transformed data into the database
    await queryInterface.bulkInsert('Assignments', assignments, {})
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Assignments', null, {})
  }
}
