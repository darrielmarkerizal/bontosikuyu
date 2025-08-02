import { getModels } from "@/lib/models";

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
}
