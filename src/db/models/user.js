'use strict'
const bcrypt = require('bcrypt')
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {

  class User extends Model {
    static associate(models) {
      User.hasMany(models.Assignment, { foreignKey: 'user', as: 'assignments' })
      User.hasMany(models.ApiKey, { foreignKey: 'user', as: 'apiKeys' })
    }

    async validatePassword(password) {
      return bcrypt.compare(password, this.password)
    }

    static async findByApiKey(apiKey) {
      return await this.findOne({
        include: {
          model: sequelize.models.ApiKey,
          as: 'apiKeys',
          where: { key: apiKey },
        },
      })
    }

    async findApiKey(keyValue) {
      const apiKeys = await this.getApiKeys({
        where: { key: keyValue },
        limit: 1
      })
      return apiKeys[0] || null
    }
  }

  User.init({
    user: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    roles: DataTypes.ARRAY(DataTypes.STRING),
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password cannot be empty'
        }
      }
    },
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      async beforeCreate(user) {
        /* eslint-disable require-atomic-updates */
        user.password = await bcrypt.hash(user.password, 10)
      },
      async beforeUpdate(user) {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10)
        }
      }
    }
  })

  return User
}
