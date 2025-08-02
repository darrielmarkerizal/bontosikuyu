import { getModels } from "@/lib/models";
import { DailyStatsService } from "@/lib/daily-stats-service";

export class AnalyticsUtils {
  // Get basic stats
  static async getBasicStats(days: number = 30) {
    const models = await getModels();
    const { Op, fn, col } = require("sequelize");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const stats = await models.AnalyticsSession.findAll({
      where: {
        startTime: { [Op.gte]: startDate },
        isBot: false,
      },
      attributes: [
        [fn("COUNT", fn("DISTINCT", col("sessionId"))), "totalSessions"],
        [fn("COUNT", fn("DISTINCT", col("ipAddress"))), "uniqueVisitors"],
        [fn("AVG", col("duration")), "avgSessionDuration"],
      ],
      raw: true,
    });

    return stats[0];
  }

  // Get top pages
  static async getTopPages(days: number = 30, limit: number = 10) {
    const models = await getModels();
    const { Op, fn, col, literal } = require("sequelize");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await models.PageView.findAll({
      where: {
        viewedAt: { [Op.gte]: startDate },
      },
      attributes: [
        "page",
        [fn("COUNT", col("id")), "views"],
        [fn("COUNT", fn("DISTINCT", col("sessionId"))), "uniqueViews"],
      ],
      group: ["page"],
      order: [[literal("views"), "DESC"]],
      limit,
      raw: true,
    });
  }

  // Get device breakdown
  static async getDeviceStats(days: number = 30) {
    const models = await getModels();
    const { Op, fn, col } = require("sequelize");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await models.AnalyticsSession.findAll({
      where: {
        startTime: { [Op.gte]: startDate },
        isBot: false,
      },
      attributes: [
        "deviceType",
        [fn("COUNT", fn("DISTINCT", col("sessionId"))), "count"],
      ],
      group: ["deviceType"],
      raw: true,
    });
  }

  /**
   * Get daily stats for dashboard
   */
  static async getDailyStatsForDashboard(days: number = 30) {
    try {
      const endDate = new Date().toISOString().split("T")[0];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateStr = startDate.toISOString().split("T")[0];

      const stats = await DailyStatsService.getDailyStats(
        startDateStr,
        endDate
      );
      const summary = await DailyStatsService.getSummaryStats(
        startDateStr,
        endDate
      );

      return {
        dailyStats: stats.data,
        summary: summary.data,
      };
    } catch (error) {
      console.error("Failed to get daily stats:", error);
      throw error;
    }
  }

  /**
   * Generate today's stats (for manual trigger)
   */
  static async generateTodayStats() {
    return await DailyStatsService.generateTodayStats();
  }
}
