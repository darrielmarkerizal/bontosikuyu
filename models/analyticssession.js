"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AnalyticsSession extends Model {
    static associate(models) {
      AnalyticsSession.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      AnalyticsSession.hasMany(models.PageView, {
        foreignKey: "sessionId",
        sourceKey: "sessionId",
        as: "pageViews",
      });
    }
  }
  AnalyticsSession.init(
    {
      sessionId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      deviceType: {
        type: DataTypes.ENUM("desktop", "mobile", "tablet", "unknown"),
        allowNull: false,
        defaultValue: "unknown",
      },
      browser: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      os: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      referrer: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      landingPage: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      isBot: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "AnalyticsSession",
    }
  );
  return AnalyticsSession;
};
