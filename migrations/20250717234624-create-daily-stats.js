"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("DailyStats", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        unique: true,
      },
      totalVisitors: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      uniqueVisitors: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      totalPageViews: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      newUsers: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      returningUsers: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      mobileUsers: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      desktopUsers: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      tabletUsers: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      bounceRate: {
        type: Sequelize.DECIMAL(5, 2), // 999.99%
        allowNull: false,
        defaultValue: 0,
      },
      avgSessionDuration: {
        type: Sequelize.INTEGER, // in seconds
        allowNull: false,
        defaultValue: 0,
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
    await queryInterface.addIndex("DailyStats", ["date"]);
  },
  async down(queryInterface) {
    await queryInterface.dropTable("DailyStats");
  },
};
