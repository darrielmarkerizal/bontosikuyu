"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Articles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      articleCategoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "CategoryArticles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      writerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Writers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      status: {
        type: Sequelize.ENUM("draft", "publish"),
        allowNull: false,
        defaultValue: "draft",
      },
      content: {
        type: Sequelize.TEXT("long"),
        allowNull: false,
      },
      imageUrl: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("Articles", ["articleCategoryId"]);
    await queryInterface.addIndex("Articles", ["writerId"]);
    await queryInterface.addIndex("Articles", ["status"]);
    await queryInterface.addIndex("Articles", ["createdAt"]);
    await queryInterface.addIndex("Articles", ["status", "createdAt"]);
  },
  async down(queryInterface) {
    await queryInterface.dropTable("Articles");
  },
};
