'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Assignments', {
      user: {
        type: Sequelize.STRING,
        references: {
          model: 'Users',  // References the Users table
          key: 'user',       // References the id column in Users table
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        // primaryKey: true,
        allowNull: false,
      },
      assignment: {
        allowNull: false,
        // primaryKey: true,
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

    await queryInterface.addConstraint('Assignments', {
      fields: ['user', 'assignment'],
      type: 'primary key',
      name: 'pk_user_assignment'
    })
  },
  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable('Assignments')
  }
}
