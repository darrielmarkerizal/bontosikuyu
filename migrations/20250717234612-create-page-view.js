"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PageViews", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      sessionId: {
        type: Sequelize.STRING(100),
        allowNull: false,
        references: {
          model: "AnalyticsSessions",
          key: "sessionId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      page: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      timeOnPage: {
        type: Sequelize.INTEGER, // in seconds
        allowNull: true,
      },
      exitPage: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      viewedAt: {
        allowNull: false,
        type: Sequelize.DATE,
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

    // Add indexes
    await queryInterface.addIndex("PageViews", ["sessionId"]);
    await queryInterface.addIndex("PageViews", ["userId"]);
    await queryInterface.addIndex("PageViews", ["page"]);
    await queryInterface.addIndex("PageViews", ["viewedAt"]);
    await queryInterface.addIndex("PageViews", ["exitPage"]);
    await queryInterface.addIndex("PageViews", ["page", "viewedAt"]);
  },
  async down(queryInterface) {
    await queryInterface.dropTable("PageViews");
  },
};
