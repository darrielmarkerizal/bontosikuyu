"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CategoryArticle extends Model {
    static associate(models) {
      CategoryArticle.hasMany(models.Article, {
        foreignKey: "articleCategoryId",
        as: "articles",
      });
    }
  }
  CategoryArticle.init(
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
      modelName: "CategoryArticle",
    }
  );
  return CategoryArticle;
};
