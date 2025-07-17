"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Logs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      action: {
        type: Sequelize.ENUM(
          "CREATE",
          "UPDATE",
          "DELETE",
          "LOGIN",
          "LOGOUT",
          "VIEW",
          "DOWNLOAD",
          "UPLOAD"
        ),
        allowNull: false,
      },
      tableName: {
        type: Sequelize.STRING(100),
        allowNull: true, // Null untuk actions seperti LOGIN/LOGOUT
      },
      recordId: {
        type: Sequelize.INTEGER,
        allowNull: true, // Null untuk actions yang tidak terkait record spesifik
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true, // Null untuk anonymous actions
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      oldValues: {
        type: Sequelize.TEXT("long"), // JSON string untuk data sebelum perubahan
        allowNull: true,
      },
      newValues: {
        type: Sequelize.TEXT("long"), // JSON string untuk data setelah perubahan
        allowNull: true,
      },
      ipAddress: {
        type: Sequelize.STRING(45), // Support IPv6
        allowNull: true,
      },
      userAgent: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING(500),
        allowNull: true, // Deskripsi tambahan
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

    // Add indexes for better performance
    await queryInterface.addIndex("Logs", ["action"]);
    await queryInterface.addIndex("Logs", ["tableName"]);
    await queryInterface.addIndex("Logs", ["recordId"]);
    await queryInterface.addIndex("Logs", ["userId"]);
    await queryInterface.addIndex("Logs", ["createdAt"]);
    await queryInterface.addIndex("Logs", ["action", "tableName"]); // Composite index
    await queryInterface.addIndex("Logs", ["userId", "createdAt"]); // Composite index
    await queryInterface.addIndex("Logs", ["ipAddress"]);
  },
  async down(queryInterface) {
    await queryInterface.dropTable("Logs");
  },
};
