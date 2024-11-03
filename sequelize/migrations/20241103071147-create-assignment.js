'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Assignments', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      params: {
        type: Sequelize.JSON
      },
      user_params: {
        type: Sequelize.ARRAY(Sequelize.STRING), // Add the array of strings here
        allowNull: true,
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
    await queryInterface.dropTable('Assignments')
  }
}
