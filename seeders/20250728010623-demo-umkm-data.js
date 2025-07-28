"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Helper function to get random element from array
    const getRandomElement = (arr) =>
      arr[Math.floor(Math.random() * arr.length)];

    // Helper function to generate random phone number
    const generatePhone = () => {
      const prefixes = ["0812", "0813", "0821", "0822", "0851", "0852", "0853"];
      const prefix = getRandomElement(prefixes);
      const number = Math.floor(Math.random() * 100000000)
        .toString()
        .padStart(8, "0");
      return prefix + number;
    };

    const dusunOptions = [
      "Dusun Laiyolo",
      "Dusun Pangkaje'ne",
      "Dusun Timoro",
      "Dusun Kilotepo",
    ];

    const umkmData = [
      // Kuliner & Makanan (Category ID: 1)
      {
        umkmName: "Warung Makan Bu Sari",
        ownerName: "Sari Dewi",
        umkmCategoryId: 1,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Kue Tradisional Laiyolo",
        ownerName: "Andi Nurhayati",
        umkmCategoryId: 1,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Es Kelapa Muda Segar",
        ownerName: "Muhammad Ridwan",
        umkmCategoryId: 1,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Bakso Ikan Laut",
        ownerName: "Pak Hasan",
        umkmCategoryId: 1,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Keripik Pisang Manis",
        ownerName: "Fatimah Abdullah",
        umkmCategoryId: 1,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1541592553160-82008b523dad?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Perikanan & Kelautan (Category ID: 2)
      {
        umkmName: "Ikan Segar Laiyolo",
        ownerName: "Pak Usman",
        umkmCategoryId: 2,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Rumput Laut Organik",
        ownerName: "Nurhayati Said",
        umkmCategoryId: 2,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Ikan Asin Kualitas Super",
        ownerName: "Abdul Rahman",
        umkmCategoryId: 2,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1565680018434-b513d5924020?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Lobster Segar Selayar",
        ownerName: "Muhammad Yusuf",
        umkmCategoryId: 2,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Kepiting Rajungan Laiyolo",
        ownerName: "Siti Aminah",
        umkmCategoryId: 2,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Pertanian & Perkebunan (Category ID: 3)
      {
        umkmName: "Kelapa Organik Laiyolo",
        ownerName: "Andi Muhammad",
        umkmCategoryId: 3,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1585515656969-a0b677c2675b?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Cengkih Premium Selayar",
        ownerName: "Pak Mappanyukki",
        umkmCategoryId: 3,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Jambu Mete Kualitas Ekspor",
        ownerName: "Hj. Ramlah",
        umkmCategoryId: 3,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1514543250559-83867827ecce?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Sayuran Hidroponik Segar",
        ownerName: "Muhammad Iqbal",
        umkmCategoryId: 3,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Buah Tropis Laiyolo",
        ownerName: "Sitti Rahma",
        umkmCategoryId: 3,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Kerajinan Tangan (Category ID: 4)
      {
        umkmName: "Anyaman Bambu Laiyolo",
        ownerName: "Pak Asri",
        umkmCategoryId: 4,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Kerajinan Kerang Laut",
        ownerName: "Nurlela Sari",
        umkmCategoryId: 4,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Tas Rajutan Tradisional",
        ownerName: "Ibu Hasna",
        umkmCategoryId: 4,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Hiasan Dinding Kayu",
        ownerName: "Muhammad Syukur",
        umkmCategoryId: 4,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Souvenir Khas Selayar",
        ownerName: "Andi Tenri",
        umkmCategoryId: 4,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Perdagangan & Retail (Category ID: 5)
      {
        umkmName: "Toko Kelontong Berkah",
        ownerName: "Pak Darwis",
        umkmCategoryId: 5,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1556909114-8ba9e6b4c9e9?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Mini Market Laiyolo",
        ownerName: "Hj. Salmiah",
        umkmCategoryId: 5,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1555529902-7d126c6a7b2d?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Pasar Ikan Segar",
        ownerName: "Abdul Majid",
        umkmCategoryId: 5,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Toko Alat Nelayan",
        ownerName: "Muhammad Ilham",
        umkmCategoryId: 5,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1578914498310-bb7a33ce9ac6?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Warung Sembako Murah",
        ownerName: "Ibu Halimah",
        umkmCategoryId: 5,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1601598851547-4302969d0669?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Jasa & Layanan (Category ID: 6)
      {
        umkmName: "Bengkel Motor Laiyolo",
        ownerName: "Pak Ruslan",
        umkmCategoryId: 6,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Jasa Perbaikan Jaring",
        ownerName: "Saharuddin",
        umkmCategoryId: 6,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Salon Kecantikan Cantik",
        ownerName: "Sitti Aisyah",
        umkmCategoryId: 6,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Jasa Cuci Motor",
        ownerName: "Ahmad Wijaya",
        umkmCategoryId: 6,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Jasa Perbaikan Kapal",
        ownerName: "Pak Amiruddin",
        umkmCategoryId: 6,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Pariwisata & Wisata (Category ID: 7)
      {
        umkmName: "Homestay Pantai Indah",
        ownerName: "Pak Syamsul",
        umkmCategoryId: 7,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Penyewaan Perahu Wisata",
        ownerName: "Muhammad Arif",
        umkmCategoryId: 7,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1516815231560-8f41ec531527?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Guide Wisata Lokal",
        ownerName: "Andi Kurniawan",
        umkmCategoryId: 7,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Penyewaan Alat Snorkeling",
        ownerName: "Rizki Pratama",
        umkmCategoryId: 7,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Cafe Pemandangan Laut",
        ownerName: "Sari Wulandari",
        umkmCategoryId: 7,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Teknologi & Digital (Category ID: 8)
      {
        umkmName: "Warnet & Printing",
        ownerName: "Muhammad Fadli",
        umkmCategoryId: 8,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Jasa Fotografi",
        ownerName: "Andi Maulana",
        umkmCategoryId: 8,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Servis HP & Elektronik",
        ownerName: "Reza Firmansyah",
        umkmCategoryId: 8,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1609552806790-e4b78e90bd60?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Jasa Desain Grafis",
        ownerName: "Nuraini Putri",
        umkmCategoryId: 8,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Toko Aksesoris HP",
        ownerName: "Pak Irwan",
        umkmCategoryId: 8,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Fashion & Tekstil (Category ID: 9)
      {
        umkmName: "Jahit Pakaian Modern",
        ownerName: "Bu Rosmiati",
        umkmCategoryId: 9,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Toko Baju Pantai",
        ownerName: "Andi Sitti",
        umkmCategoryId: 9,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Seragam Sekolah Laiyolo",
        ownerName: "Muhammad Saleh",
        umkmCategoryId: 9,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Aksesoris Fashion",
        ownerName: "Sitti Khadijah",
        umkmCategoryId: 9,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Sepatu & Sandal",
        ownerName: "Pak Mahmud",
        umkmCategoryId: 9,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Otomotif & Transportasi (Category ID: 10)
      {
        umkmName: "Rental Motor Harian",
        ownerName: "Andi Surya",
        umkmCategoryId: 10,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Ojek Online Laiyolo",
        ownerName: "Muhammad Farid",
        umkmCategoryId: 10,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Jual Beli Motor Bekas",
        ownerName: "Pak Wahyu",
        umkmCategoryId: 10,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1542362567-b07e54358753?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Sparepart Motor",
        ownerName: "Abdul Karim",
        umkmCategoryId: 10,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1537808084320-e041b5dd7eac?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        umkmName: "Transportasi Antar Pulau",
        ownerName: "Kapten Hasanuddin",
        umkmCategoryId: 10,
        dusun: getRandomElement(dusunOptions),
        phone: generatePhone(),
        image:
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=300&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Umkms", umkmData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Umkms", null, {});
  },
};
