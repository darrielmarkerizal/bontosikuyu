"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const travelData = [
      // Dusun Laiyolo - 13 destinasi
      {
        name: "Pantai Laiyolo",
        dusun: "Dusun Laiyolo",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        travelCategoryId: 1, // Pantai
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dermaga Nelayan Laiyolo",
        dusun: "Dusun Laiyolo",
        image:
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
        travelCategoryId: 2, // Budaya
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sunset Point Laiyolo",
        dusun: "Dusun Laiyolo",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        travelCategoryId: 1, // Pantai
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Rumah Adat Laiyolo",
        dusun: "Dusun Laiyolo",
        image:
          "https://images.unsplash.com/photo-1570939274717-7eda259b50ed?w=800",
        travelCategoryId: 2, // Budaya
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Pasar Tradisional Laiyolo",
        dusun: "Dusun Laiyolo",
        image:
          "https://images.unsplash.com/photo-1555976250-7c0dd309f1c8?w=800",
        travelCategoryId: 2, // Budaya
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Bukit Pengintai Laiyolo",
        dusun: "Dusun Laiyolo",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        travelCategoryId: 3, // Alam
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Teluk Laiyolo",
        dusun: "Dusun Laiyolo",
        image:
          "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800",
        travelCategoryId: 1, // Pantai
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Kebun Kelapa Laiyolo",
        dusun: "Dusun Laiyolo",
        image:
          "https://images.unsplash.com/photo-1551524164-687a55dd1126?w=800",
        travelCategoryId: 3, // Alam
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Warung Makan Bu Ati",
        dusun: "Dusun Laiyolo",
        image:
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
        travelCategoryId: 4, // Kuliner
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Spot Snorkeling Laiyolo",
        dusun: "Dusun Laiyolo",
        image:
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
        travelCategoryId: 5, // Olahraga Air
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Makam Keramat Laiyolo",
        dusun: "Dusun Laiyolo",
        image:
          "https://images.unsplash.com/photo-1570939274717-7eda259b50ed?w=800",
        travelCategoryId: 6, // Religi
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Jembatan Kayu Laiyolo",
        dusun: "Dusun Laiyolo",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        travelCategoryId: 2, // Budaya
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Pantai Batu Karang Laiyolo",
        dusun: "Dusun Laiyolo",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        travelCategoryId: 1, // Pantai
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Dusun Pangkaje'ne - 12 destinasi
      {
        name: "Pantai Pangkaje'ne",
        dusun: "Dusun Pangkaje'ne",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        travelCategoryId: 1, // Pantai
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Hutan Mangrove Pangkaje'ne",
        dusun: "Dusun Pangkaje'ne",
        image:
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
        travelCategoryId: 3, // Alam
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sanggar Tari Pangkaje'ne",
        dusun: "Dusun Pangkaje'ne",
        image:
          "https://images.unsplash.com/photo-1570939274717-7eda259b50ed?w=800",
        travelCategoryId: 2, // Budaya
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Warung Seafood Pak Hasan",
        dusun: "Dusun Pangkaje'ne",
        image:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800",
        travelCategoryId: 4, // Kuliner
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Spot Memancing Pangkaje'ne",
        dusun: "Dusun Pangkaje'ne",
        image:
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
        travelCategoryId: 5, // Olahraga Air
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Masjid Tua Pangkaje'ne",
        dusun: "Dusun Pangkaje'ne",
        image:
          "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800",
        travelCategoryId: 6, // Religi
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Gua Batu Pangkaje'ne",
        dusun: "Dusun Pangkaje'ne",
        image:
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
        travelCategoryId: 3, // Alam
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Pelabuhan Mini Pangkaje'ne",
        dusun: "Dusun Pangkaje'ne",
        image:
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
        travelCategoryId: 2, // Budaya
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Taman Bermain Anak Pangkaje'ne",
        dusun: "Dusun Pangkaje'ne",
        image:
          "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
        travelCategoryId: 7, // Rekreasi
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Café Sunset Pangkaje'ne",
        dusun: "Dusun Pangkaje'ne",
        image:
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
        travelCategoryId: 4, // Kuliner
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Spot Diving Pangkaje'ne",
        dusun: "Dusun Pangkaje'ne",
        image:
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
        travelCategoryId: 5, // Olahraga Air
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Pantai Pasir Putih Pangkaje'ne",
        dusun: "Dusun Pangkaje'ne",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        travelCategoryId: 1, // Pantai
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Dusun Timoro - 12 destinasi
      {
        name: "Bukit Timoro",
        dusun: "Dusun Timoro",
        image:
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
        travelCategoryId: 3, // Alam
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Air Terjun Timoro",
        dusun: "Dusun Timoro",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        travelCategoryId: 3, // Alam
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Museum Mini Timoro",
        dusun: "Dusun Timoro",
        image:
          "https://images.unsplash.com/photo-1570939274717-7eda259b50ed?w=800",
        travelCategoryId: 2, // Budaya
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Kedai Kopi Timoro",
        dusun: "Dusun Timoro",
        image:
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
        travelCategoryId: 4, // Kuliner
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Lapangan Sepak Bola Timoro",
        dusun: "Dusun Timoro",
        image:
          "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
        travelCategoryId: 7, // Rekreasi
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Pura Timoro",
        dusun: "Dusun Timoro",
        image:
          "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800",
        travelCategoryId: 6, // Religi
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Kebun Sayur Organik Timoro",
        dusun: "Dusun Timoro",
        image:
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
        travelCategoryId: 3, // Alam
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Balai Desa Timoro",
        dusun: "Dusun Timoro",
        image:
          "https://images.unsplash.com/photo-1570939274717-7eda259b50ed?w=800",
        travelCategoryId: 2, // Budaya
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Warung Gudeg Bu Tini",
        dusun: "Dusun Timoro",
        image:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800",
        travelCategoryId: 4, // Kuliner
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Taman Bacaan Timoro",
        dusun: "Dusun Timoro",
        image:
          "https://images.unsplash.com/photo-1570939274717-7eda259b50ed?w=800",
        travelCategoryId: 2, // Budaya
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Pos Kesehatan Timoro",
        dusun: "Dusun Timoro",
        image:
          "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
        travelCategoryId: 8, // Fasilitas Umum
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sungai Timoro",
        dusun: "Dusun Timoro",
        image:
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
        travelCategoryId: 3, // Alam
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Dusun Kilotepo - 13 destinasi
      {
        name: "Pantai Kilotepo",
        dusun: "Dusun Kilotepo",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        travelCategoryId: 1, // Pantai
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Mercusuar Kilotepo",
        dusun: "Dusun Kilotepo",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        travelCategoryId: 2, // Budaya
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Desa Wisata Kilotepo",
        dusun: "Dusun Kilotepo",
        image:
          "https://images.unsplash.com/photo-1570939274717-7eda259b50ed?w=800",
        travelCategoryId: 2, // Budaya
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Spot Surfing Kilotepo",
        dusun: "Dusun Kilotepo",
        image:
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
        travelCategoryId: 5, // Olahraga Air
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Restoran Seafood Kilotepo",
        dusun: "Dusun Kilotepo",
        image:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800",
        travelCategoryId: 4, // Kuliner
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Gereja Tua Kilotepo",
        dusun: "Dusun Kilotepo",
        image:
          "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800",
        travelCategoryId: 6, // Religi
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Hutan Lindung Kilotepo",
        dusun: "Dusun Kilotepo",
        image:
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
        travelCategoryId: 3, // Alam
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Pelabuhan Kilotepo",
        dusun: "Dusun Kilotepo",
        image:
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
        travelCategoryId: 2, // Budaya
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Villa Tepi Pantai Kilotepo",
        dusun: "Dusun Kilotepo",
        image:
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
        travelCategoryId: 9, // Akomodasi
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Tebing Kilotepo",
        dusun: "Dusun Kilotepo",
        image:
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
        travelCategoryId: 3, // Alam
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Pasar Ikan Kilotepo",
        dusun: "Dusun Kilotepo",
        image:
          "https://images.unsplash.com/photo-1555976250-7c0dd309f1c8?w=800",
        travelCategoryId: 2, // Budaya
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Spot Kayaking Kilotepo",
        dusun: "Dusun Kilotepo",
        image:
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
        travelCategoryId: 5, // Olahraga Air
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Pantai Tersembunyi Kilotepo",
        dusun: "Dusun Kilotepo",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        travelCategoryId: 1, // Pantai
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Travels", travelData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Travels", null, {});
  },
};
