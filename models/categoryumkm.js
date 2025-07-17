"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CategoryUmkm extends Model {
    static associate(models) {
      CategoryUmkm.hasMany(models.Umkm, {
        foreignKey: "umkmCategoryId",
        as: "umkms",
      });
    }
  }
  CategoryUmkm.init(
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
      modelName: "CategoryUmkm",
    }
  );
  return CategoryUmkm;
};
