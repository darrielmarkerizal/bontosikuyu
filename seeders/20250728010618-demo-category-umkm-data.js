"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "CategoryUmkms",
      [
        {
          name: "Kuliner & Makanan",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Perikanan & Kelautan",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Pertanian & Perkebunan",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Kerajinan Tangan",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Perdagangan & Retail",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Jasa & Layanan",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Pariwisata & Wisata",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Teknologi & Digital",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Fashion & Tekstil",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Otomotif & Transportasi",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("CategoryUmkms", null, {});
  },
};
