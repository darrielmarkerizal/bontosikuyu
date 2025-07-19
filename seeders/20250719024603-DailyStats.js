"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const stats = [];
    const startDate = new Date("2025-02-19T00:00:00.000Z"); // Feb 19, 2025
    const endDate = new Date("2025-07-19T00:00:00.000Z"); // July 19, 2025
    const days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1; // 150 days

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const totalVisitors = Math.floor(Math.random() * 1000) + 50; // 50-1050
      const uniqueVisitors = Math.floor(
        totalVisitors * (Math.random() * 0.4 + 0.5)
      ); // 50%-90% of totalVisitors
      const newUsers = Math.floor(uniqueVisitors * (Math.random() * 0.3 + 0.1)); // 10%-40% of uniqueVisitors
      const returningUsers = Math.floor(
        uniqueVisitors * (Math.random() * 0.5 + 0.4)
      ); // 40%-90% of uniqueVisitors, adjusted to not exceed uniqueVisitors
      const mobileUsers = Math.floor(
        totalVisitors * (Math.random() * 0.4 + 0.3)
      ); // 30%-70% of totalVisitors
      const desktopUsers = Math.floor(
        totalVisitors * (Math.random() * 0.3 + 0.2)
      ); // 20%-50% of totalVisitors
      const tabletUsers = Math.floor(
        totalVisitors * (Math.random() * 0.2 + 0.1)
      ); // 10%-30% of totalVisitors
      const totalPageViews = Math.floor(
        totalVisitors * (Math.random() * 5 + 1)
      ); // 1-6 pages per visitor
      const bounceRate = Number((Math.random() * 80 + 20).toFixed(2)); // 20.00-100.00%
      const avgSessionDuration = Math.floor(Math.random() * 570 + 30); // 30-600 seconds

      stats.push({
        date: date.toISOString().split("T")[0], // YYYY-MM-DD format for DATEONLY
        totalVisitors,
        uniqueVisitors: Math.min(uniqueVisitors, totalVisitors), // Ensure uniqueVisitors <= totalVisitors
        totalPageViews,
        newUsers,
        returningUsers: Math.min(returningUsers, uniqueVisitors - newUsers), // Ensure newUsers + returningUsers <= uniqueVisitors
        mobileUsers,
        desktopUsers,
        tabletUsers,
        bounceRate,
        avgSessionDuration,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert("DailyStats", stats, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("DailyStats", null, {});
  },
};
