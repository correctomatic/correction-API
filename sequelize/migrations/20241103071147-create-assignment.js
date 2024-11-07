'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Assignments', {
      user: {
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
      fields: ['user', 'assignment'],
      type: 'primary key',
      name: 'pk_user_assignment'
    })

    // Add check constraints to enforce non-empty strings
    await queryInterface.sequelize.query(`
      ALTER TABLE "Assignments"
      ADD CONSTRAINT user_not_empty CHECK (user <> ''),
      ADD CONSTRAINT assignment_not_empty CHECK (assignment <> ''),
      ADD CONSTRAINT image_not_empty CHECK (image <> '')
    `)
  },
  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable('Assignments')
  }
}
