'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {

  class Assignment extends Model {
    static associate(models) {
      Assignment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
    }
  }

  Assignment.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    image: DataTypes.STRING,
    params: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Assignment',
  })

  return Assignment
}
