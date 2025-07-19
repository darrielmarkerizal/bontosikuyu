"use strict";

module.exports = {
  up: async (queryInterface) => {
    const firstNames = [
      "Ahmad",
      "Siti",
      "Budi",
      "Aisyah",
      "Rudi",
      "Nurul",
      "Agus",
      "Dewi",
      "Hassan",
      "Fatima",
      "Iwan",
      "Lina",
      "Rizky",
      "Eka",
      "Dedi",
      "Yanti",
      "Fajar",
      "Rina",
      "Tono",
      "Sari",
      "Joko",
      "Mira",
      "Andi",
      "Wulan",
      "Hendra",
      "Tuti",
      "Arif",
      "Lia",
      "Bayu",
      "Rita",
    ];
    const lastNames = [
      "Pratama",
      "Sari",
      "Wijaya",
      "Ningsih",
      "Saputra",
      "Lestari",
      "Rahman",
      "Putri",
      "Hidayat",
      "Kusuma",
      "Santoso",
      "Wati",
      "Purnama",
      "Siregar",
      "Utami",
      "Hadi",
      "Novita",
      "Setiawan",
      "Aminah",
      "Gunawan",
    ];
    const dusuns = [
      "Dusun Laiyolo",
      "Dusun Pangkaje'ne",
      "Dusun Timoro",
      "Dusun Kilotepo",
    ];

    const writers = [];
    const usedPhoneNumbers = new Set();

    for (let i = 0; i < 100; i++) {
      // Generate unique fullName
      let fullName;
      do {
        fullName = `${
          firstNames[Math.floor(Math.random() * firstNames.length)]
        } ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
      } while (writers.some((w) => w.fullName === fullName));

      // Generate unique phoneNumber
      let phoneNumber;
      do {
        const phoneSuffix = Math.floor(
          10000000 + Math.random() * 90000000
        ).toString(); // 8-digit suffix
        phoneNumber = `+628${phoneSuffix.padStart(8, "0")}`; // e.g., +62812345678
      } while (usedPhoneNumbers.has(phoneNumber));
      usedPhoneNumbers.add(phoneNumber);

      const timestamp = new Date(
        Date.now() - Math.floor(Math.random() * 150 * 24 * 60 * 60 * 1000)
      ); // Last 5 months

      writers.push({
        fullName,
        phoneNumber,
        dusun: dusuns[Math.floor(Math.random() * dusuns.length)],
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    }

    await queryInterface.bulkInsert("Writers", writers, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Writers", null, {});
  },
};
