'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PageView extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PageView.init({
    sessionId: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    page: DataTypes.STRING,
    title: DataTypes.STRING,
    timeOnPage: DataTypes.INTEGER,
    exitPage: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'PageView',
  });
  return PageView;
};