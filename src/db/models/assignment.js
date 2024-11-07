'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {

  class Assignment extends Model {
    static associate(models) {
      Assignment.belongsTo(models.User, { foreignKey: 'user', as: 'owner' })
    }
  }

  // Assignment has a composite primary key of userId and assignmentId
  Assignment.init({
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
    assignment: {
      type: DataTypes.STRING,
      primaryKey: true,
      validate: {
        notEmpty: {
          msg: 'Assignment cannot be empty'
        }
      }
    },
    image: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Image cannot be empty'
        }
      }
    },
    params: DataTypes.JSON,
    user_params: DataTypes.ARRAY(DataTypes.STRING),
  }, {
    sequelize,
    modelName: 'Assignment',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId','assignment']
      }
    ]
  })

  return Assignment
}
