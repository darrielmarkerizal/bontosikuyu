"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fetch existing sessionIds from AnalyticsSessions (assumes AnalyticsSessions seeder has run)
    const sessionIds = await queryInterface.sequelize.query(
      'SELECT sessionId, userId FROM "AnalyticsSessions"',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (sessionIds.length === 0) {
      throw new Error(
        "No records found in AnalyticsSessions. Run AnalyticsSessions seeder first."
      );
    }

    const pages = [
      { path: "/home", title: "Home Page" },
      { path: "/products", title: "Products" },
      { path: "/about", title: "About Us" },
      { path: "/contact", title: "Contact Us" },
      { path: "/blog", title: "Blog" },
      { path: "/pricing", title: "Pricing Plans" },
      { path: "/login", title: "Login" },
    ];

    const pageViews = [];
    let recordCount = 0;

    // Generate 1-3 page views per session to reach ~1000 records
    for (const session of sessionIds) {
      const numPageViews = Math.floor(Math.random() * 3) + 1; // 1-3 page views per session
      for (let i = 0; i < numPageViews && recordCount < 1000; i++) {
        const page = pages[Math.floor(Math.random() * pages.length)];
        const viewedAt = new Date(
          Date.now() - Math.floor(Math.random() * 150 * 24 * 60 * 60 * 1000)
        ); // Last 5 months
        const timeOnPage =
          Math.random() > 0.3 ? Math.floor(Math.random() * 300) + 30 : null; // 30-330 seconds or null
        const exitPage = i === numPageViews - 1 && Math.random() > 0.5; // 50% chance for last page view in session

        pageViews.push({
          sessionId: session.sessionId,
          userId: session.userId, // Inherit userId from AnalyticsSessions or null
          page: page.path,
          title: page.title,
          timeOnPage,
          exitPage,
          viewedAt,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        recordCount++;
      }
      if (recordCount >= 1000) break;
    }

    // If fewer than 1000 records, add more by reusing sessionIds
    while (recordCount < 1000) {
      const session = sessionIds[Math.floor(Math.random() * sessionIds.length)];
      const page = pages[Math.floor(Math.random() * pages.length)];
      const viewedAt = new Date(
        Date.now() - Math.floor(Math.random() * 150 * 24 * 60 * 60 * 1000)
      );
      const timeOnPage =
        Math.random() > 0.3 ? Math.floor(Math.random() * 300) + 30 : null;

      pageViews.push({
        sessionId: session.sessionId,
        userId: session.userId,
        page: page.path,
        title: page.title,
        timeOnPage,
        exitPage: Math.random() > 0.5,
        viewedAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      recordCount++;
    }

    await queryInterface.bulkInsert("PageViews", pageViews, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("PageViews", null, {});
  },
};
