"use strict";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DailyStats extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  DailyStats.init(
    {
      date: DataTypes.DATEONLY,
      totalVisitors: DataTypes.INTEGER,
      uniqueVisitors: DataTypes.INTEGER,
      totalPageViews: DataTypes.INTEGER,
      newUsers: DataTypes.INTEGER,
      returningUsers: DataTypes.INTEGER,
      mobileUsers: DataTypes.INTEGER,
      desktopUsers: DataTypes.INTEGER,
      bounceRate: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "DailyStats",
    }
  );
  return DailyStats;
};
