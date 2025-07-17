"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Writer extends Model {
    static associate(models) {
      // define association here
      Writer.hasMany(models.Article, {
        foreignKey: "writerId",
        as: "articles",
      });
    }
  }
  Writer.init(
    {
      fullName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 100],
        },
      },
      phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          notEmpty: true,
          isNumeric: true,
          len: [10, 20],
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
    },
    {
      sequelize,
      modelName: "Writer",
    }
  );
  return Writer;
};
