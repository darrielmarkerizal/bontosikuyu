"use strict";

module.exports = {
  up: async (queryInterface) => {
    const writers = [
      {
        id: 1,
        fullName: "Baharuddin",
        phoneNumber: "+6281111111111",
        dusun: "Dusun Laiyolo",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        fullName: "Nur Febriani",
        phoneNumber: "+6282222222222",
        dusun: "Dusun Pangkaje'ne",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        fullName: "Aldevano",
        phoneNumber: "+6283333333333",
        dusun: "Dusun Timoro",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        fullName: "Niken Permata",
        phoneNumber: "+6284444444444",
        dusun: "Dusun Kilotepo",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        fullName: "Darriel",
        phoneNumber: "+6285555555555",
        dusun: "Dusun Laiyolo",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Writers", writers, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Writers", null, {});
  },
};
