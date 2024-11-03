'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {

  class Assignment extends Model {
    static associate(models) {
      Assignment.belongsTo(models.User, { foreignKey: 'user', as: 'user' })
    }
  }

  // Assignment has a composite primary key of userId and assignmentId
  Assignment.init({
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'User', // References User model
        key: 'id',
      }
    },
    assignment: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    image: DataTypes.STRING,
    params: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Assignment',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId','id']
      }
    ]
  })

  return Assignment
}
