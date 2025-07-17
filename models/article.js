"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {
      // define association here
      Article.belongsTo(models.CategoryArticle, {
        foreignKey: "articleCategoryId",
        as: "category",
      });
      Article.belongsTo(models.Writer, {
        foreignKey: "writerId",
        as: "writer",
      });
    }
  }
  Article.init(
    {
      articleCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: true,
          isInt: true,
        },
      },
      writerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: true,
          isInt: true,
        },
      },
      status: {
        type: DataTypes.ENUM("draft", "publish"),
        allowNull: false,
        defaultValue: "draft",
        validate: {
          isIn: [["draft", "publish"]],
        },
      },
      content: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [10], // Minimum 10 characters
        },
      },
      imageUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
    },
    {
      sequelize,
      modelName: "Article",
    }
  );
  return Article;
};
