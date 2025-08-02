"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const categories = [
      {
        id: 1,
        name: "Pantai",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "Budaya",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: "Alam",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        name: "Kuliner",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        name: "Olahraga Air",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 6,
        name: "Religi",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 7,
        name: "Rekreasi",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 8,
        name: "Fasilitas Umum",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 9,
        name: "Akomodasi",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 10,
        name: "Sungai",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("TravelCategories", categories, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("TravelCategories", null, {});
  },
};
