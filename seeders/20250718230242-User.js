"use strict";
const CryptoJS = require("crypto-js");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          fullName: "Alice Johnson",
          email: "alice.johnson@example.com",
          username: "alicej",
          password: CryptoJS.SHA256("passAlice1").toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullName: "Bob Carter",
          email: "bob.carter@example.com",
          username: "bobc",
          password: CryptoJS.SHA256("passBob2").toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullName: "Clara Evans",
          email: "clara.evans@example.com",
          username: "clarae",
          password: CryptoJS.SHA256("passClara3").toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullName: "David Lee",
          email: "david.lee@example.com",
          username: "davidl",
          password: CryptoJS.SHA256("passDavid4").toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullName: "Emma Brown",
          email: "emma.brown@example.com",
          username: "emmab",
          password: CryptoJS.SHA256("passEmma5").toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullName: "Frank Wilson",
          email: "frank.wilson@example.com",
          username: "frankw",
          password: CryptoJS.SHA256("passFrank6").toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullName: "Grace Kim",
          email: "grace.kim@example.com",
          username: "gracek",
          password: CryptoJS.SHA256("passGrace7").toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullName: "Henry Adams",
          email: "henry.adams@example.com",
          username: "henrya",
          password: CryptoJS.SHA256("passHenry8").toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullName: "Isabella Chen",
          email: "isabella.chen@example.com",
          username: "isabellac",
          password: CryptoJS.SHA256("passIsabella9").toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullName: "James Patel",
          email: "james.patel@example.com",
          username: "jamesp",
          password: CryptoJS.SHA256("passJames10").toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullName: "Kelly Nguyen",
          email: "kelly.nguyen@example.com",
          username: "kellyn",
          password: CryptoJS.SHA256("passKelly11").toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullName: "Liam Garcia",
          email: "liam.garcia@example.com",
          username: "liamg",
          password: CryptoJS.SHA256("passLiam12").toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullName: "Mia Thompson",
          email: "mia.thompson@example.com",
          username: "miat",
          password: CryptoJS.SHA256("passMia13").toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullName: "Noah Martinez",
          email: "noah.martinez@example.com",
          username: "noahm",
          password: CryptoJS.SHA256("passNoah14").toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullName: "Olivia Davis",
          email: "olivia.davis@example.com",
          username: "oliviad",
          password: CryptoJS.SHA256("passOlivia15").toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullName: "Peter Clark",
          email: "peter.clark@example.com",
          username: "peterc",
          password: CryptoJS.SHA256("passPeter16").toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullName: "Quinn Harris",
          email: "quinn.harris@example.com",
          username: "quinnh",
          password: CryptoJS.SHA256("passQuinn17").toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullName: "Rachel Lewis",
          email: "rachel.lewis@example.com",
          username: "rachell",
          password: CryptoJS.SHA256("passRachel18").toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullName: "Samuel Walker",
          email: "samuel.walker@example.com",
          username: "samuelw",
          password: CryptoJS.SHA256("passSamuel19").toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullName: "Tara Young",
          email: "tara.young@example.com",
          username: "taray",
          password: CryptoJS.SHA256("passTara20").toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
