"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Travels", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false,
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
      image: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      travelCategoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "TravelCategories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
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

    await queryInterface.addIndex("Travels", ["name"]);
    await queryInterface.addIndex("Travels", ["dusun"]);
    await queryInterface.addIndex("Travels", ["travelCategoryId"]);
    await queryInterface.addIndex("Travels", ["dusun", "travelCategoryId"]);
    await queryInterface.addIndex("Travels", ["createdAt"]);
  },
  async down(queryInterface) {
    await queryInterface.dropTable("Travels");
  },
};
