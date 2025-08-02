import { getModels } from "./models";

// Define interfaces for raw query results
interface RawSessionStats {
  totalVisitors: string | number;
  uniqueVisitors: string | number;
  mobileUsers: string | number;
  desktopUsers: string | number;
  tabletUsers: string | number;
  avgSessionDuration: string | number;
}

interface RawPageViewStats {
  totalPageViews: string | number;
}

export class DailyStatsService {
  /**
   * Generate daily stats for a specific date
   */
  static async generateDailyStats(date: string) {
    try {
      const models = await getModels();
      const { Op, fn, col, literal } = require("sequelize");

      console.log(`📊 Generating daily stats for ${date}`);

      // Get session stats for the date
      const sessionStats = await models.AnalyticsSession.findAll({
        where: {
          startTime: {
            [Op.gte]: `${date} 00:00:00`,
            [Op.lte]: `${date} 23:59:59`,
          },
          isBot: false,
        },
        attributes: [
          [fn("COUNT", fn("DISTINCT", col("sessionId"))), "totalVisitors"],
          [fn("COUNT", fn("DISTINCT", col("ipAddress"))), "uniqueVisitors"],
          [
            fn(
              "COUNT",
              fn(
                "DISTINCT",
                literal("CASE WHEN deviceType = 'mobile' THEN sessionId END")
              )
            ),
            "mobileUsers",
          ],
          [
            fn(
              "COUNT",
              fn(
                "DISTINCT",
                literal("CASE WHEN deviceType = 'desktop' THEN sessionId END")
              )
            ),
            "desktopUsers",
          ],
          [
            fn(
              "COUNT",
              fn(
                "DISTINCT",
                literal("CASE WHEN deviceType = 'tablet' THEN sessionId END")
              )
            ),
            "tabletUsers",
          ],
          [fn("AVG", col("duration")), "avgSessionDuration"],
        ],
        raw: true,
      });

      // Get page view stats
      const pageViewStats = await models.PageView.findAll({
        where: {
          viewedAt: {
            [Op.gte]: `${date} 00:00:00`,
            [Op.lte]: `${date} 23:59:59`,
          },
        },
        attributes: [[fn("COUNT", col("id")), "totalPageViews"]],
        raw: true,
      });

      // Calculate bounce rate (sessions with only 1 page view)
      const bounceRateData = await models.PageView.findAll({
        where: {
          viewedAt: {
            [Op.gte]: `${date} 00:00:00`,
            [Op.lte]: `${date} 23:59:59`,
          },
        },
        attributes: ["sessionId", [fn("COUNT", col("id")), "pageCount"]],
        group: ["sessionId"],
        having: literal("pageCount = 1"),
        raw: true,
      });

      const stats = sessionStats[0] as unknown as RawSessionStats;
      const pageStats = pageViewStats[0] as unknown as RawPageViewStats;
      const bounceCount = bounceRateData.length;
      const bounceRate =
        Number(stats.totalVisitors) > 0
          ? (bounceCount * 100.0) / Number(stats.totalVisitors)
          : 0;

      // Insert or update daily stats
      await models.DailyStats.upsert({
        date,
        totalVisitors: Number(stats.totalVisitors) || 0,
        uniqueVisitors: Number(stats.uniqueVisitors) || 0,
        totalPageViews: Number(pageStats.totalPageViews) || 0,
        mobileUsers: Number(stats.mobileUsers) || 0,
        desktopUsers: Number(stats.desktopUsers) || 0,
        tabletUsers: Number(stats.tabletUsers) || 0,
        bounceRate: parseFloat(bounceRate.toFixed(2)),
        avgSessionDuration: Math.floor(Number(stats.avgSessionDuration) || 0),
      });

      console.log(`✅ Daily stats generated for ${date}:`, {
        totalVisitors: Number(stats.totalVisitors) || 0,
        uniqueVisitors: Number(stats.uniqueVisitors) || 0,
        totalPageViews: Number(pageStats.totalPageViews) || 0,
        bounceRate: parseFloat(bounceRate.toFixed(2)),
      });

      return {
        success: true,
        data: {
          date,
          totalVisitors: Number(stats.totalVisitors) || 0,
          uniqueVisitors: Number(stats.uniqueVisitors) || 0,
          totalPageViews: Number(pageStats.totalPageViews) || 0,
          mobileUsers: Number(stats.mobileUsers) || 0,
          desktopUsers: Number(stats.desktopUsers) || 0,
          tabletUsers: Number(stats.tabletUsers) || 0,
          bounceRate: parseFloat(bounceRate.toFixed(2)),
          avgSessionDuration: Math.floor(Number(stats.avgSessionDuration) || 0),
        },
      };
    } catch (error) {
      console.error("❌ Error generating daily stats:", error);
      throw error;
    }
  }

  /**
   * Generate daily stats for the current date
   */
  static async generateTodayStats() {
    const today = new Date().toISOString().split("T")[0];
    return await this.generateDailyStats(today);
  }

  /**
   * Generate daily stats for a date range
   */
  static async generateDateRangeStats(startDate: string, endDate: string) {
    const results = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split("T")[0];
      try {
        const result = await this.generateDailyStats(dateStr);
        results.push(result);
      } catch (error) {
        console.error(`Failed to generate stats for ${dateStr}:`, error);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return results;
  }

  /**
   * Get daily stats for a date range
   */
  static async getDailyStats(startDate: string, endDate: string) {
    try {
      const models = await getModels();
      const { Op } = require("sequelize");

      const stats = await models.DailyStats.findAll({
        where: {
          date: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          },
        },
        order: [["date", "ASC"]],
        raw: true,
      });

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      console.error("❌ Error fetching daily stats:", error);
      throw error;
    }
  }

  /**
   * Get summary stats for a date range
   */
  static async getSummaryStats(startDate: string, endDate: string) {
    try {
      const models = await getModels();
      const { Op, fn, col } = require("sequelize");

      const summary = await models.DailyStats.findAll({
        where: {
          date: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          },
        },
        attributes: [
          [fn("SUM", col("totalVisitors")), "totalVisitors"],
          [fn("SUM", col("uniqueVisitors")), "uniqueVisitors"],
          [fn("SUM", col("totalPageViews")), "totalPageViews"],
          [fn("SUM", col("mobileUsers")), "mobileUsers"],
          [fn("SUM", col("desktopUsers")), "desktopUsers"],
          [fn("SUM", col("tabletUsers")), "tabletUsers"],
          [fn("AVG", col("bounceRate")), "avgBounceRate"],
          [fn("AVG", col("avgSessionDuration")), "avgSessionDuration"],
        ],
        raw: true,
      });

      return {
        success: true,
        data: summary[0],
      };
    } catch (error) {
      console.error("❌ Error fetching summary stats:", error);
      throw error;
    }
  }
}
