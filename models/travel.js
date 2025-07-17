"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Travel extends Model {
    static associate(models) {
      Travel.belongsTo(models.TravelCategory, {
        foreignKey: "travelCategoryId",
        as: "category",
      });
    }
  }
  Travel.init(
    {
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 200],
        },
      },
      dusun: {
        type: DataTypes.ENUM(
          "Dusun Laiyolo",
          "Dusun Pangkaje'ne",
          "Dusun Timoro",
          "Dusun Kilotepo"
        ),
        allowNull: false,
        validate: {
          isIn: [
            [
              "Dusun Laiyolo",
              "Dusun Pangkaje'ne",
              "Dusun Timoro",
              "Dusun Kilotepo",
            ],
          ],
        },
      },
      image: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      travelCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: true,
          isInt: true,
        },
      },
    },
    {
      sequelize,
      modelName: "Travel",
    }
  );
  return Travel;
};
