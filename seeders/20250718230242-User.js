"use strict";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const CryptoJS = require("crypto-js");

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          id: 1,
          fullName: "Baharuddin",
          email: "baharuddin@laiyolobaru.com",
          username: "baharuddin",
          password: CryptoJS.SHA256("bahar123").toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          fullName: "Nur Febriani",
          email: "nurfebriani@laiyolobaru.com",
          username: "nurfebriani",
          password: CryptoJS.SHA256("febri123").toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          fullName: "Aldevano",
          email: "aldevano@laiyolobaru.com",
          username: "aldevano",
          password: CryptoJS.SHA256("aldo123").toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          fullName: "Niken Permata",
          email: "nikenpermata@laiyolobaru.com",
          username: "nikenpermata",
          password: CryptoJS.SHA256("niken123").toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          fullName: "Darriel",
          email: "darriel@laiyolobaru.com",
          username: "darriel",
          password: CryptoJS.SHA256("darel123").toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
