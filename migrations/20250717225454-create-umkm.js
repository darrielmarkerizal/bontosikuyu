"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Umkms", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      umkmName: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      ownerName: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      umkmCategoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "CategoryUmkms",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      dusun: {
        type: Sequelize.ENUM(
          "Dusun Laiyolo",
          "Dusun Pangkaje'ne",
          "Dusun Timoro",
          "Dusun Kilotepo"
        ),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      image: {
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

    // Add indexes for better performance
    await queryInterface.addIndex("Umkms", ["umkmName"]);
    await queryInterface.addIndex("Umkms", ["ownerName"]);
    await queryInterface.addIndex("Umkms", ["umkmCategoryId"]);
    await queryInterface.addIndex("Umkms", ["dusun"]);
    await queryInterface.addIndex("Umkms", ["phone"]);
  },
  async down(queryInterface) {
    await queryInterface.dropTable("Umkms");
  },
};
