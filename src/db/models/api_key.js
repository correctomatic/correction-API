'use strict'
const { Model } = require('sequelize')
const crypto = require('crypto')

module.exports = (sequelize, DataTypes) => {

  class ApiKey extends Model {
    static associate(models) {
      ApiKey.belongsTo(models.User, { foreignKey: 'user', as: 'owner' })
    }
  }

  ApiKey.init({
    user: {
      type: DataTypes.STRING,
      primaryKey: true,
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
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      defaultValue: () => crypto.randomBytes(32).toString('hex')
    },
  }, {
    sequelize,
    modelName: 'ApiKey',
    timestamps: true
  })

  return ApiKey
}
