'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('ApiKeys', {
      key: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      username: {
        type: Sequelize.STRING,
        references: {
          model: 'Users', // Assumes a Users table exists with a primary key 'user'
          key: 'username'
        },
        allowNull: false,
        validate: {
          notEmpty: true
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    })

    // Add check constraints to enforce non-empty strings
    await queryInterface.sequelize.query(`
      ALTER TABLE "ApiKeys"
      ADD CONSTRAINT username_not_empty CHECK (username <> '')
    `)

  },

  async down (queryInterface, _Sequelize) {
    await queryInterface.dropTable('ApiKeys')
  }
};
