import { getDatabase } from "./database";

interface SessionData {
  sessionId: string;
  userId?: number;
  ipAddress: string;
  userAgent?: string;
  deviceType: "desktop" | "mobile" | "tablet" | "unknown";
  browser?: string;
  os?: string;
  country?: string;
  city?: string;
  referrer?: string;
  landingPage: string;
  isBot?: boolean;
}

interface PageViewData {
  sessionId: string;
  userId?: number;
  page: string;
  title?: string;
  timeOnPage?: number;
  exitPage?: boolean;
}

export class Analytics {
  // Get models instance
  private static async getModels() {
    const db = require("../../models");
    return db;
  }

  // Detect device type from user agent
  static detectDeviceType(
    userAgent: string
  ): "desktop" | "mobile" | "tablet" | "unknown" {
    if (!userAgent) return "unknown";

    const ua = userAgent.toLowerCase();
    if (/tablet|ipad|playbook|silk|kindle/i.test(ua)) return "tablet";
    if (/mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua))
      return "mobile";
    return "desktop";
  }

  // Detect browser from user agent
  static detectBrowser(userAgent: string): string {
    if (!userAgent) return "unknown";

    const ua = userAgent.toLowerCase();
    if (ua.includes("chrome")) return "Chrome";
    if (ua.includes("firefox")) return "Firefox";
    if (ua.includes("safari")) return "Safari";
    if (ua.includes("edge")) return "Edge";
    if (ua.includes("opera")) return "Opera";
    return "unknown";
  }

  // Detect OS from user agent
  static detectOS(userAgent: string): string {
    if (!userAgent) return "unknown";

    const ua = userAgent.toLowerCase();
    if (ua.includes("windows")) return "Windows";
    if (ua.includes("mac")) return "macOS";
    if (ua.includes("linux")) return "Linux";
    if (ua.includes("android")) return "Android";
    if (ua.includes("ios") || ua.includes("iphone") || ua.includes("ipad"))
      return "iOS";
    return "unknown";
  }

  // Check if request is from bot
  static isBot(userAgent: string): boolean {
    if (!userAgent) return false;

    const botPatterns = [
      "bot",
      "crawler",
      "spider",
      "scraper",
      "search",
      "google",
      "bing",
      "yahoo",
      "facebook",
      "twitter",
    ];

    return botPatterns.some((pattern) =>
      userAgent.toLowerCase().includes(pattern)
    );
  }

  // Get client IP
  static getClientIP(req: any): string {
    return (
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.headers["x-real-ip"] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.ip ||
      "127.0.0.1"
    );
  }

  // Track new session
  static async trackSession(data: SessionData) {
    try {
      const models = await this.getModels();

      await models.AnalyticsSession.create({
        sessionId: data.sessionId,
        userId: data.userId || null,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent || null,
        deviceType: data.deviceType,
        browser: data.browser || null,
        os: data.os || null,
        country: data.country || null,
        city: data.city || null,
        referrer: data.referrer || null,
        landingPage: data.landingPage,
        isBot: data.isBot || false,
        startTime: new Date(),
      });

      console.log(`Session tracked: ${data.sessionId}`);
    } catch (error) {
      console.error("Failed to track session:", error);
    }
  }

  // Track page view
  static async trackPageView(data: PageViewData) {
    try {
      const models = await this.getModels();

      await models.PageView.create({
        sessionId: data.sessionId,
        userId: data.userId || null,
        page: data.page,
        title: data.title || null,
        timeOnPage: data.timeOnPage || null,
        exitPage: data.exitPage || false,
        viewedAt: new Date(),
      });

      console.log(`Page view tracked: ${data.page}`);
    } catch (error) {
      console.error("Failed to track page view:", error);
    }
  }

  // Update session end time
  static async endSession(sessionId: string) {
    try {
      const models = await this.getModels();

      const session = await models.AnalyticsSession.findOne({
        where: { sessionId },
      });

      if (session) {
        const endTime = new Date();
        const duration = Math.floor(
          (endTime.getTime() - session.startTime.getTime()) / 1000
        );

        await session.update({
          endTime,
          duration,
        });

        console.log(`Session ended: ${sessionId}`);
      }
    } catch (error) {
      console.error("Failed to end session:", error);
    }
  }

  // Generate daily stats
  static async generateDailyStats(date: string) {
    try {
      const models = await this.getModels();
      const { Op, fn, col, literal } = require("sequelize");

      // Get stats for the date
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

      const stats = sessionStats[0] as any;
      const pageStats = pageViewStats[0] as any;
      const bounceCount = bounceRateData.length;
      const bounceRate =
        stats.totalVisitors > 0
          ? (bounceCount * 100.0) / stats.totalVisitors
          : 0;

      // Insert or update daily stats
      await models.DailyStats.upsert({
        date,
        totalVisitors: stats.totalVisitors || 0,
        uniqueVisitors: stats.uniqueVisitors || 0,
        totalPageViews: pageStats.totalPageViews || 0,
        mobileUsers: stats.mobileUsers || 0,
        desktopUsers: stats.desktopUsers || 0,
        tabletUsers: stats.tabletUsers || 0,
        bounceRate: parseFloat(bounceRate.toFixed(2)),
        avgSessionDuration: Math.floor(stats.avgSessionDuration || 0),
      });

      console.log(`Daily stats generated for ${date}`);
    } catch (error) {
      console.error("Failed to generate daily stats:", error);
    }
  }

  // Get dashboard overview stats
  static async getDashboardStats(days: number = 30) {
    try {
      const models = await this.getModels();
      const { Op, fn, col, literal } = require("sequelize");

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Overview stats
      const overview = await models.AnalyticsSession.findAll({
        where: {
          startTime: {
            [Op.gte]: startDate,
          },
          isBot: false,
        },
        attributes: [
          [fn("COUNT", fn("DISTINCT", col("sessionId"))), "totalSessions"],
          [fn("COUNT", fn("DISTINCT", col("ipAddress"))), "uniqueVisitors"],
          [
            fn(
              "COUNT",
              fn(
                "DISTINCT",
                literal("CASE WHEN userId IS NOT NULL THEN userId END")
              )
            ),
            "loggedInUsers",
          ],
          [fn("AVG", col("duration")), "avgSessionDuration"],
        ],
        raw: true,
      });

      // Device breakdown
      const deviceStats = await models.AnalyticsSession.findAll({
        where: {
          startDate: {
            [Op.gte]: startDate,
          },
          isBot: false,
        },
        attributes: [
          "deviceType",
          [fn("COUNT", fn("DISTINCT", col("sessionId"))), "count"],
        ],
        group: ["deviceType"],
        raw: true,
      });

      // Top pages
      const topPages = await models.PageView.findAll({
        where: {
          viewedAt: {
            [Op.gte]: startDate,
          },
        },
        attributes: [
          "page",
          [fn("COUNT", col("id")), "views"],
          [fn("COUNT", fn("DISTINCT", col("sessionId"))), "uniqueViews"],
        ],
        group: ["page"],
        order: [[literal("views"), "DESC"]],
        limit: 10,
        raw: true,
      });

      // Daily trend
      const dailyTrend = await models.AnalyticsSession.findAll({
        where: {
          startTime: {
            [Op.gte]: startDate,
          },
          isBot: false,
        },
        attributes: [
          [fn("DATE", col("startTime")), "date"],
          [fn("COUNT", fn("DISTINCT", col("sessionId"))), "sessions"],
          [fn("COUNT", fn("DISTINCT", col("ipAddress"))), "uniqueVisitors"],
        ],
        group: [fn("DATE", col("startTime"))],
        order: [[fn("DATE", col("startTime")), "ASC"]],
        raw: true,
      });

      // Browser stats
      const browserStats = await models.AnalyticsSession.findAll({
        where: {
          startTime: {
            [Op.gte]: startDate,
          },
          isBot: false,
        },
        attributes: [
          "browser",
          [fn("COUNT", fn("DISTINCT", col("sessionId"))), "count"],
        ],
        group: ["browser"],
        order: [[literal("count"), "DESC"]],
        limit: 5,
        raw: true,
      });

      // Traffic sources
      const trafficSources = await models.AnalyticsSession.findAll({
        where: {
          startTime: {
            [Op.gte]: startDate,
          },
          isBot: false,
        },
        attributes: [
          [
            literal(`CASE 
            WHEN referrer IS NULL OR referrer = '' THEN 'Direct'
            WHEN referrer LIKE '%google%' THEN 'Google'
            WHEN referrer LIKE '%facebook%' THEN 'Facebook'
            WHEN referrer LIKE '%twitter%' THEN 'Twitter'
            ELSE 'Other'
          END`),
            "source",
          ],
          [fn("COUNT", fn("DISTINCT", col("sessionId"))), "count"],
        ],
        group: [
          literal(`CASE 
          WHEN referrer IS NULL OR referrer = '' THEN 'Direct'
          WHEN referrer LIKE '%google%' THEN 'Google'
          WHEN referrer LIKE '%facebook%' THEN 'Facebook'
          WHEN referrer LIKE '%twitter%' THEN 'Twitter'
          ELSE 'Other'
        END`),
        ],
        order: [[literal("count"), "DESC"]],
        raw: true,
      });

      return {
        overview: overview[0],
        deviceStats,
        topPages,
        dailyTrend,
        browserStats,
        trafficSources,
      };
    } catch (error) {
      console.error("Failed to get dashboard stats:", error);
      throw error;
    }
  }

  // Get logs with pagination and filters
  static async getLogs(
    options: {
      page?: number;
      limit?: number;
      action?: string;
      tableName?: string;
      userId?: number;
      startDate?: string;
      endDate?: string;
    } = {}
  ) {
    try {
      const models = await this.getModels();
      const { Op } = require("sequelize");

      const {
        page = 1,
        limit = 50,
        action,
        tableName,
        userId,
        startDate,
        endDate,
      } = options;

      const offset = (page - 1) * limit;
      const where: any = {};

      if (action) where.action = action;
      if (tableName) where.tableName = tableName;
      if (userId) where.userId = userId;
      if (startDate) where.viewedAt = { [Op.gte]: startDate };
      if (endDate) {
        where.viewedAt = {
          ...where.viewedAt,
          [Op.lte]: endDate,
        };
      }

      const { count, rows } = await models.PageView.findAndCountAll({
        where,
        include: [
          {
            model: models.User,
            as: "user",
            attributes: ["fullName", "email"],
            required: false,
          },
        ],
        order: [["viewedAt", "DESC"]],
        limit,
        offset,
      });

      return {
        data: rows,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      console.error("Failed to get logs:", error);
      throw error;
    }
  }
}
