'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Assignment, { foreignKey: 'userId', as: 'assignments' })
    }
  }
  User.init({
    roles: DataTypes.ARRAY(DataTypes.STRING),
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  })
  return User
}
