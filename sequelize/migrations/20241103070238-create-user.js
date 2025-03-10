'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      user: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      roles: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable('Users')
  }
}
