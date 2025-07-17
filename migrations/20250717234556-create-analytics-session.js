"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AnalyticsSessions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      sessionId: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
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
      ipAddress: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      userAgent: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      deviceType: {
        type: Sequelize.ENUM("desktop", "mobile", "tablet", "unknown"),
        allowNull: false,
        defaultValue: "unknown",
      },
      browser: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      os: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      referrer: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      landingPage: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      isBot: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      startTime: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      endTime: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      duration: {
        type: Sequelize.INTEGER, // in seconds
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

    // Add indexes
    await queryInterface.addIndex("AnalyticsSessions", ["sessionId"]);
    await queryInterface.addIndex("AnalyticsSessions", ["userId"]);
    await queryInterface.addIndex("AnalyticsSessions", ["ipAddress"]);
    await queryInterface.addIndex("AnalyticsSessions", ["deviceType"]);
    await queryInterface.addIndex("AnalyticsSessions", ["country"]);
    await queryInterface.addIndex("AnalyticsSessions", ["startTime"]);
    await queryInterface.addIndex("AnalyticsSessions", ["isBot"]);
    await queryInterface.addIndex("AnalyticsSessions", [
      "startTime",
      "deviceType",
    ]);
  },
  async down(queryInterface) {
    await queryInterface.dropTable("AnalyticsSessions");
  },
};
