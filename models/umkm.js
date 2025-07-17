"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Umkm extends Model {
    static associate(models) {
      // define association here
      Umkm.belongsTo(models.CategoryUmkm, {
        foreignKey: "umkmCategoryId",
        as: "category",
      });
    }
  }
  Umkm.init(
    {
      umkmName: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 150],
        },
      },
      ownerName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 100],
        },
      },
      umkmCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: true,
          isInt: true,
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
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          notEmpty: true,
          isNumeric: true,
          len: [10, 20],
        },
      },
      image: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
    },
    {
      sequelize,
      modelName: "Umkm",
    }
  );
  return Umkm;
};
