"use strict";

module.exports = {
  up: async (queryInterface) => {
    const categories = [
      {
        id: 1,
        name: "Berita",
        createdAt: new Date("2025-02-20T10:00:00.000+08:00"),
        updatedAt: new Date("2025-02-20T10:00:00.000+08:00"),
      },
      {
        id: 2,
        name: "Kebudayaan",
        createdAt: new Date("2025-02-22T12:00:00.000+08:00"),
        updatedAt: new Date("2025-02-22T12:00:00.000+08:00"),
      },
      {
        id: 3,
        name: "Teknologi",
        createdAt: new Date("2025-02-25T14:00:00.000+08:00"),
        updatedAt: new Date("2025-02-25T14:00:00.000+08:00"),
      },
      {
        id: 4,
        name: "Pendidikan",
        createdAt: new Date("2025-03-01T09:00:00.000+08:00"),
        updatedAt: new Date("2025-03-01T09:00:00.000+08:00"),
      },
      {
        id: 5,
        name: "Kesehatan",
        createdAt: new Date("2025-03-05T11:00:00.000+08:00"),
        updatedAt: new Date("2025-03-05T11:00:00.000+08:00"),
      },
      {
        id: 6,
        name: "Olahraga",
        createdAt: new Date("2025-03-10T13:00:00.000+08:00"),
        updatedAt: new Date("2025-03-10T13:00:00.000+08:00"),
      },
      {
        id: 7,
        name: "Ekonomi",
        createdAt: new Date("2025-03-15T15:00:00.000+08:00"),
        updatedAt: new Date("2025-03-15T15:00:00.000+08:00"),
      },
      {
        id: 8,
        name: "Politik",
        createdAt: new Date("2025-03-20T10:00:00.000+08:00"),
        updatedAt: new Date("2025-03-20T10:00:00.000+08:00"),
      },
      {
        id: 9,
        name: "Lingkungan",
        createdAt: new Date("2025-03-25T12:00:00.000+08:00"),
        updatedAt: new Date("2025-03-25T12:00:00.000+08:00"),
      },
      {
        id: 10,
        name: "Seni",
        createdAt: new Date("2025-04-01T14:00:00.000+08:00"),
        updatedAt: new Date("2025-04-01T14:00:00.000+08:00"),
      },
      {
        id: 11,
        name: "Pariwisata",
        createdAt: new Date("2025-04-05T09:00:00.000+08:00"),
        updatedAt: new Date("2025-04-05T09:00:00.000+08:00"),
      },
      {
        id: 12,
        name: "Kuliner",
        createdAt: new Date("2025-04-10T11:00:00.000+08:00"),
        updatedAt: new Date("2025-04-10T11:00:00.000+08:00"),
      },
      {
        id: 13,
        name: "Hiburan",
        createdAt: new Date("2025-04-15T13:00:00.000+08:00"),
        updatedAt: new Date("2025-04-15T13:00:00.000+08:00"),
      },
      {
        id: 14,
        name: "Agama",
        createdAt: new Date("2025-04-20T15:00:00.000+08:00"),
        updatedAt: new Date("2025-04-20T15:00:00.000+08:00"),
      },
      {
        id: 15,
        name: "Sosial",
        createdAt: new Date("2025-04-25T10:00:00.000+08:00"),
        updatedAt: new Date("2025-04-25T10:00:00.000+08:00"),
      },
      {
        id: 16,
        name: "Hukum",
        createdAt: new Date("2025-05-01T12:00:00.000+08:00"),
        updatedAt: new Date("2025-05-01T12:00:00.000+08:00"),
      },
      {
        id: 17,
        name: "Inovasi",
        createdAt: new Date("2025-05-05T14:00:00.000+08:00"),
        updatedAt: new Date("2025-05-05T14:00:00.000+08:00"),
      },
      {
        id: 18,
        name: "Sejarah",
        createdAt: new Date("2025-05-10T09:00:00.000+08:00"),
        updatedAt: new Date("2025-05-10T09:00:00.000+08:00"),
      },
      {
        id: 19,
        name: "Lifestyle",
        createdAt: new Date("2025-05-15T11:00:00.000+08:00"),
        updatedAt: new Date("2025-05-15T11:00:00.000+08:00"),
      },
      {
        id: 20,
        name: "Komunitas",
        createdAt: new Date("2025-05-20T13:00:00.000+08:00"),
        updatedAt: new Date("2025-05-20T13:00:00.000+08:00"),
      },
    ];

    await queryInterface.bulkInsert("CategoryArticles", categories, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("CategoryArticles", null, {});
  },
};
