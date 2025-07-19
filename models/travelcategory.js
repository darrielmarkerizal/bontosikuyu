"use strict";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TravelCategory extends Model {
    static associate(models) {
      TravelCategory.hasMany(models.Travel, {
        foreignKey: "travelCategoryId",
        as: "travels",
      });
    }
  }
  TravelCategory.init(
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [2, 100],
        },
      },
    },
    {
      sequelize,
      modelName: "TravelCategory",
    }
  );
  return TravelCategory;
};
