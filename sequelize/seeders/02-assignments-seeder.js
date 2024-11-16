'use strict'

const path = require('path')
const parseCSV = require('./lib/read_csv')

function paramsToObject(params) {
  if (!params) return null

  const object = params.split(';').reduce((acc, param) => {
    const [key, value] = param.split('=')
    acc[key] = value
    return acc
  }, {})

  return JSON.stringify(object)
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Read the CSV file with the data to seed
    // The params field expects a text with param=value;param2=value2 format
    // The allowed_user_params field expects a list of parameters separated by semicolons
    const assignmentsData = await parseCSV(path.resolve(__dirname, './data/assignments.csv'))

    const assignments = await Promise.all(assignmentsData.map(async (row) => {
      return {
        user: row.user,
        assignment: row.assignment,
        image: row.image,
        params: paramsToObject(row.params),
        allowed_user_params: row.allowed_user_params ? row.allowed_user_params?.split(';') : null,
        createdAt: row.createdAt || new Date(),
        updatedAt: row.updatedAt || new Date()
      }
    }))

    // Bulk insert transformed data into the database
    await queryInterface.bulkInsert('Assignments', assignments, {logging: console.log})
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Assignments', null, {})
  }
}
