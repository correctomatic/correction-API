'use strict'
const bcrypt = require('bcrypt')
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {

  class User extends Model {
    static associate(models) {
      User.hasMany(models.Assignment, { foreignKey: 'user', as: 'assignments' })
    }

    async validatePassword(password) {
      return bcrypt.compare(password, this.password)
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
