"use strict";

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();
    const categories = [
      { id: 1, name: "Berita" },
      { id: 2, name: "Kebudayaan" },
      { id: 3, name: "Pendidikan" },
      { id: 4, name: "Kesehatan" },
      { id: 5, name: "Lingkungan" },
      { id: 6, name: "Pariwisata" },
      { id: 7, name: "Kuliner" },
      { id: 8, name: "Sosial dan Hukum" },
      { id: 9, name: "Ekonomi Desa" },
      { id: 10, name: "UMKM" },
      { id: 11, name: "Pertanian dan Perikanan" },
      { id: 12, name: "Karang Taruna" },
      { id: 13, name: "Layanan Publik" },
      { id: 14, name: "Kegiatan Warga" },
      { id: 15, name: "BumDes" },
    ].map((item) => ({
      ...item,
      createdAt: now,
      updatedAt: now,
    }));

    await queryInterface.bulkInsert("CategoryArticles", categories, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("CategoryArticles", null, {});
  },
};
