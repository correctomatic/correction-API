'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Assignments', {
      userId: {
        type: Sequelize.STRING,
        references: {
          model: 'Users',
          key: 'user',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      assignment: {
        allowNull: false,
        type: Sequelize.STRING
      },
      image: {
        allowNull: false,
        type: Sequelize.STRING
      },
      params: {
        allowNull: true,
        type: Sequelize.JSON
      },
      user_params: {
        allowNull: true,
        type: Sequelize.ARRAY(Sequelize.STRING), // Add the array of strings here
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
      fields: ['userId', 'assignment'],
      type: 'primary key',
      name: 'pk_user_assignment'
    })
  },
  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable('Assignments')
  }
}
