"use strict";

module.exports = {
  up: async (queryInterface) => {
    const categories = [
      {
        name: "Berita",
        createdAt: new Date("2025-02-20T10:00:00.000+08:00"),
        updatedAt: new Date("2025-02-20T10:00:00.000+08:00"),
      },
      {
        name: "Kebudayaan",
        createdAt: new Date("2025-02-22T12:00:00.000+08:00"),
        updatedAt: new Date("2025-02-22T12:00:00.000+08:00"),
      },
      {
        name: "Teknologi",
        createdAt: new Date("2025-02-25T14:00:00.000+08:00"),
        updatedAt: new Date("2025-02-25T14:00:00.000+08:00"),
      },
      {
        name: "Pendidikan",
        createdAt: new Date("2025-03-01T09:00:00.000+08:00"),
        updatedAt: new Date("2025-03-01T09:00:00.000+08:00"),
      },
      {
        name: "Kesehatan",
        createdAt: new Date("2025-03-05T11:00:00.000+08:00"),
        updatedAt: new Date("2025-03-05T11:00:00.000+08:00"),
      },
      {
        name: "Olahraga",
        createdAt: new Date("2025-03-10T13:00:00.000+08:00"),
        updatedAt: new Date("2025-03-10T13:00:00.000+08:00"),
      },
      {
        name: "Ekonomi",
        createdAt: new Date("2025-03-15T15:00:00.000+08:00"),
        updatedAt: new Date("2025-03-15T15:00:00.000+08:00"),
      },
      {
        name: "Politik",
        createdAt: new Date("2025-03-20T10:00:00.000+08:00"),
        updatedAt: new Date("2025-03-20T10:00:00.000+08:00"),
      },
      {
        name: "Lingkungan",
        createdAt: new Date("2025-03-25T12:00:00.000+08:00"),
        updatedAt: new Date("2025-03-25T12:00:00.000+08:00"),
      },
      {
        name: "Seni",
        createdAt: new Date("2025-04-01T14:00:00.000+08:00"),
        updatedAt: new Date("2025-04-01T14:00:00.000+08:00"),
      },
      {
        name: "Pariwisata",
        createdAt: new Date("2025-04-05T09:00:00.000+08:00"),
        updatedAt: new Date("2025-04-05T09:00:00.000+08:00"),
      },
      {
        name: "Kuliner",
        createdAt: new Date("2025-04-10T11:00:00.000+08:00"),
        updatedAt: new Date("2025-04-10T11:00:00.000+08:00"),
      },
      {
        name: "Hiburan",
        createdAt: new Date("2025-04-15T13:00:00.000+08:00"),
        updatedAt: new Date("2025-04-15T13:00:00.000+08:00"),
      },
      {
        name: "Agama",
        createdAt: new Date("2025-04-20T15:00:00.000+08:00"),
        updatedAt: new Date("2025-04-20T15:00:00.000+08:00"),
      },
      {
        name: "Sosial",
        createdAt: new Date("2025-04-25T10:00:00.000+08:00"),
        updatedAt: new Date("2025-04-25T10:00:00.000+08:00"),
      },
      {
        name: "Hukum",
        createdAt: new Date("2025-05-01T12:00:00.000+08:00"),
        updatedAt: new Date("2025-05-01T12:00:00.000+08:00"),
      },
      {
        name: "Inovasi",
        createdAt: new Date("2025-05-05T14:00:00.000+08:00"),
        updatedAt: new Date("2025-05-05T14:00:00.000+08:00"),
      },
      {
        name: "Sejarah",
        createdAt: new Date("2025-05-10T09:00:00.000+08:00"),
        updatedAt: new Date("2025-05-10T09:00:00.000+08:00"),
      },
      {
        name: "Lifestyle",
        createdAt: new Date("2025-05-15T11:00:00.000+08:00"),
        updatedAt: new Date("2025-05-15T11:00:00.000+08:00"),
      },
      {
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
