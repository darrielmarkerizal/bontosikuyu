"use strict";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface) => {
    const sessions = Array.from({ length: 1000 }, (_, index) => {
      const userId =
        index % 3 === 0 ? null : Math.floor(Math.random() * 20) + 1; // Random userId from 1 to 20 or null
      const startTime = new Date(
        Date.now() - Math.floor(Math.random() * 150 * 24 * 60 * 60 * 1000)
      ); // Random time in last 5 months
      const endTime =
        Math.random() > 0.2
          ? new Date(startTime.getTime() + Math.floor(Math.random() * 3600000))
          : null; // Random end time or null
      const duration = endTime
        ? Math.floor((endTime - startTime) / 1000)
        : null; // Duration in seconds or null
      const deviceTypes = ["desktop", "mobile", "tablet", "unknown"];
      const browsers = ["Chrome", "Firefox", "Safari", "Edge", "Opera", null];
      const osList = ["Windows", "macOS", "Linux", "iOS", "Android", null];
      const countries = [
        "USA",
        "UK",
        "Canada",
        "India",
        "Japan",
        "Germany",
        "France",
        "Brazil",
        "Australia",
        null,
      ];
      const cities = [
        "New York",
        "London",
        "Toronto",
        "Mumbai",
        "Tokyo",
        "Berlin",
        "Paris",
        "Sao Paulo",
        "Sydney",
        null,
      ];
      const referrers = [
        "https://google.com",
        "https://bing.com",
        "https://yahoo.com",
        "https://example.com",
        null,
      ];
      const landingPages = [
        "/home",
        "/products",
        "/about",
        "/contact",
        "/blog",
        "/pricing",
        "/login",
      ];

      return {
        sessionId: `${uuidv4().slice(0, 20)}-${index + 1}`, // Unique sessionId
        userId,
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        userAgent: `Mozilla/5.0 (${osList[Math.floor(Math.random() * osList.length)] || "Windows"} NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ${browsers[Math.floor(Math.random() * browsers.length)] || "Chrome"}/120.0.0.0 Safari/537.36`,
        deviceType: deviceTypes[Math.floor(Math.random() * deviceTypes.length)],
        browser: browsers[Math.floor(Math.random() * browsers.length)],
        os: osList[Math.floor(Math.random() * osList.length)],
        country: countries[Math.floor(Math.random() * countries.length)],
        city: cities[Math.floor(Math.random() * cities.length)],
        referrer: referrers[Math.floor(Math.random() * referrers.length)],
        landingPage:
          landingPages[Math.floor(Math.random() * landingPages.length)],
        isBot: Math.random() > 0.9, // 10% chance of being a bot
        startTime,
        endTime,
        duration,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    await queryInterface.bulkInsert("AnalyticsSessions", sessions, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("AnalyticsSessions", null, {});
  },
};
