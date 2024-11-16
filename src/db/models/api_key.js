'use strict'
const { Model } = require('sequelize')
const crypto = require('crypto')

module.exports = (sequelize, DataTypes) => {

  class ApiKey extends Model {
    static associate(models) {
      ApiKey.belongsTo(models.User, { foreignKey: 'user', as: 'owner' })
    }

    // Override the default create method to use the retry logic
    static async create(values, options) {
      return this.createWithRetry(values, options)
    }

    // Retry logic function
    // This shouldn't be a problem since the key is generated randomly, but who knows
    static async createWithRetry(values, options, maxRetries = 3) {
      let attempt = 0
      let apiKeyData = { ...values }

      while (attempt < maxRetries) {
        try {
          // Attempt to create the ApiKey
          /* eslint-disable no-await-in-loop */
          const apiKey = await super.create(apiKeyData, options)
          return apiKey
        } catch (error) {
          // Check for duplicate key error
          if (error.name === 'SequelizeUniqueConstraintError') {
            // If it's a duplicate error, regenerate the key and retry
            apiKeyData.key = crypto.randomBytes(32).toString('hex')
            attempt += 1
          } else {
            // If the error is not related to a duplicate key, throw it
            throw error
          }
        }
      }
    }
  }

  ApiKey.init({
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      defaultValue: () => crypto.randomBytes(32).toString('hex')
    },
    user: {
      type: DataTypes.STRING,
      references: {
        model: 'User',
        key: 'user',
      },
      validate: {
        notEmpty: {
          msg: 'User cannot be empty'
        }
      }
    },
  }, {
    sequelize,
    modelName: 'ApiKey',
    timestamps: true
  })

  return ApiKey
}
