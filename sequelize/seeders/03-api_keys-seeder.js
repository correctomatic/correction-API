'use strict'

import path from 'path'
import parseCSV from './lib/read_csv'

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    const apiKeysData = await parseCSV(path.resolve(__dirname,'./data/api_keys.csv'))

    const users = await Promise.all(apiKeysData.map(async (row) => ({
      key: row.key,
      username: row.username,
      createdAt: row.createdAt || new Date(),
      updatedAt: row.updatedAt || new Date()
    })))

    // Bulk insert transformed data into the database
    await queryInterface.bulkInsert('ApiKeys', users, {})
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('ApiKeys', null, {})
  }
}
