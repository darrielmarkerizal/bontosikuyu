import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";

// Define interfaces for combined statistics
interface OverallStatistics {
  totalSessions: number;
  totalPageViews: number;
  totalUniqueVisitors: number;
  totalUniqueUsers: number;
  avgSessionDuration: number;
  avgTimeOnPage: number;
  bounceRate: number;
  activeSessions: number;
  newUsers: number;
  returningUsers: number;
  mobileUsers: number;
  desktopUsers: number;
  botSessions: number;
  humanSessions: number;
  topCountries: Record<string, number>;
  topPages: Array<{
    page: string;
    views: number;
    avgTime: number;
    uniqueVisitors: number;
  }>;
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
    unknown: number;
  };
  userTypeBreakdown: {
    authenticated: number;
    anonymous: number;
  };
  exitPageStats: {
    exitPages: number;
    nonExitPages: number;
  };
  hourlyActivity: Array<{
    hour: number;
    sessions: number;
    pageViews: number;
  }>;
  dailyTrends: Array<{
    date: string;
    sessions: number;
    pageViews: number;
    uniqueVisitors: number;
    newUsers: number;
    bounceRate: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    sessions: number;
    pageViews: number;
    newUsers: number;
    avgSessionDuration: number;
  }>;
  realtimeStats: {
    activeNow: number;
    todaySessions: number;
    todayPageViews: number;
    todayNewUsers: number;
    last24hGrowth: {
      sessions: number;
      pageViews: number;
      users: number;
    };
  };
}

// GET - Get comprehensive statistics summary
export async function GET(request: NextRequest) {
  try {
    console.log("📊 Getting comprehensive statistics data");

    // Import sequelize and models directly
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const sequelize = require("../../../../../config/database");

    // Test database connection
    try {
      await sequelize.authenticate();
      console.log("✅ Database connection established successfully");
    } catch (error) {
      console.error("💥 Database connection failed:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Database connection failed",
          error: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }

    // Import all required models
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const AnalyticsSession =
      require("../../../../../models/analyticssession.js")(
        sequelize,
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require("sequelize").DataTypes
      );

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const PageView = require("../../../../../models/pageview.js")(
      sequelize,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("sequelize").DataTypes
    );

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const DailyStats = require("../../../../../models/dailystats.js")(
      sequelize,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("sequelize").DataTypes
    );

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const User = require("../../../../../models/user.js")(
      sequelize,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("sequelize").DataTypes
    );

    // Parse query parameters for date filtering
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const timeRange = searchParams.get("timeRange") || "30d"; // 1d, 7d, 30d, 90d, 1y

    // Calculate date range based on timeRange parameter
    let startDate = new Date();
    let endDate = new Date();

    if (dateFrom && dateTo) {
      startDate = new Date(dateFrom);
      endDate = new Date(dateTo);
    } else {
      switch (timeRange) {
        case "1d":
          startDate.setDate(startDate.getDate() - 1);
          break;
        case "7d":
          startDate.setDate(startDate.getDate() - 7);
          break;
        case "30d":
          startDate.setDate(startDate.getDate() - 30);
          break;
        case "90d":
          startDate.setDate(startDate.getDate() - 90);
          break;
        case "1y":
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        default:
          startDate.setDate(startDate.getDate() - 30);
      }
    }

    console.log("📅 Date range:", { startDate, endDate, timeRange });

    // Define common date filters
    const dateFilter = {
      createdAt: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
    };

    const dailyStatsDateFilter = {
      date: {
        [Op.gte]: startDate.toISOString().split("T")[0],
        [Op.lte]: endDate.toISOString().split("T")[0],
      },
    };

    // === BASIC COUNTS ===
    console.log("📊 Fetching basic counts...");

    const [
      totalSessions,
      totalPageViews,
      totalUniqueVisitors,
      totalUniqueUsers,
      totalUsers,
    ] = await Promise.all([
      AnalyticsSession.count({ where: dateFilter }),
      PageView.count({ where: dateFilter }),
      AnalyticsSession.count({
        distinct: true,
        col: "ipAddress",
        where: dateFilter,
      }),
      PageView.count({
        distinct: true,
        col: "userId",
        where: {
          ...dateFilter,
          userId: { [Op.not]: null },
        },
      }),
      User.count(),
    ]);

    // === SESSION STATISTICS ===
    console.log("📊 Fetching session statistics...");

    const sessionStats = await AnalyticsSession.findOne({
      attributes: [
        [sequelize.fn("AVG", sequelize.col("duration")), "avgDuration"],
        [sequelize.fn("COUNT", sequelize.col("id")), "totalSessions"],
      ],
      where: {
        ...dateFilter,
        duration: { [Op.not]: null },
      },
      raw: true,
    });

    // === PAGE VIEW STATISTICS ===
    console.log("📊 Fetching page view statistics...");

    const pageViewStats = await PageView.findOne({
      attributes: [
        [sequelize.fn("AVG", sequelize.col("timeOnPage")), "avgTimeOnPage"],
        [sequelize.fn("COUNT", sequelize.col("id")), "totalViews"],
      ],
      where: {
        ...dateFilter,
        timeOnPage: { [Op.not]: null },
      },
      raw: true,
    });

    // === DAILY STATS SUMMARY ===
    console.log("📊 Fetching daily stats summary...");

    const dailyStatsSummary = await DailyStats.findOne({
      attributes: [
        [sequelize.fn("SUM", sequelize.col("newUsers")), "totalNewUsers"],
        [
          sequelize.fn("SUM", sequelize.col("returningUsers")),
          "totalReturningUsers",
        ],
        [sequelize.fn("SUM", sequelize.col("mobileUsers")), "totalMobileUsers"],
        [
          sequelize.fn("SUM", sequelize.col("desktopUsers")),
          "totalDesktopUsers",
        ],
        [sequelize.fn("AVG", sequelize.col("bounceRate")), "avgBounceRate"],
      ],
      where: dailyStatsDateFilter,
      raw: true,
    });

    // === DEVICE BREAKDOWN ===
    console.log("📊 Fetching device breakdown...");

    const deviceBreakdown = await AnalyticsSession.findAll({
      attributes: [
        "deviceType",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: dateFilter,
      group: ["deviceType"],
      raw: true,
    });

    // === USER TYPE BREAKDOWN ===
    console.log("📊 Fetching user type breakdown...");

    const userTypeBreakdown = await AnalyticsSession.findAll({
      attributes: [
        [
          sequelize.literal(`
            CASE 
              WHEN "userId" IS NOT NULL THEN 'authenticated'
              ELSE 'anonymous'
            END
          `),
          "userType",
        ],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: dateFilter,
      group: [
        sequelize.literal(`
          CASE 
            WHEN "userId" IS NOT NULL THEN 'authenticated'
            ELSE 'anonymous'
          END
        `),
      ],
      raw: true,
    });

    // === BOT STATISTICS ===
    console.log("📊 Fetching bot statistics...");

    const botStats = await AnalyticsSession.findAll({
      attributes: [
        "isBot",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: dateFilter,
      group: ["isBot"],
      raw: true,
    });

    // === TOP COUNTRIES ===
    console.log("📊 Fetching top countries...");

    const topCountries = await AnalyticsSession.findAll({
      attributes: [
        "country",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: {
        ...dateFilter,
        country: { [Op.not]: null },
      },
      group: ["country"],
      order: [[sequelize.fn("COUNT", sequelize.col("id")), "DESC"]],
      limit: 10,
      raw: true,
    });

    // === TOP PAGES ===
    console.log("📊 Fetching top pages...");

    const topPages = await PageView.findAll({
      attributes: [
        "page",
        [sequelize.fn("COUNT", sequelize.col("id")), "views"],
        [sequelize.fn("AVG", sequelize.col("timeOnPage")), "avgTime"],
        [
          sequelize.fn("COUNT", sequelize.literal("DISTINCT sessionId")),
          "uniqueVisitors",
        ],
      ],
      where: dateFilter,
      group: ["page"],
      order: [[sequelize.fn("COUNT", sequelize.col("id")), "DESC"]],
      limit: 10,
      raw: true,
    });

    // === EXIT PAGE STATISTICS ===
    console.log("📊 Fetching exit page statistics...");

    const exitPageStats = await PageView.findAll({
      attributes: [
        "exitPage",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: dateFilter,
      group: ["exitPage"],
      raw: true,
    });

    // === HOURLY ACTIVITY ===
    console.log("📊 Fetching hourly activity...");

    const [hourlySessionActivity, hourlyPageViewActivity] = await Promise.all([
      AnalyticsSession.findAll({
        attributes: [
          [sequelize.fn("HOUR", sequelize.col("startTime")), "hour"],
          [sequelize.fn("COUNT", sequelize.col("id")), "sessions"],
        ],
        where: dateFilter,
        group: [sequelize.fn("HOUR", sequelize.col("startTime"))],
        order: [[sequelize.fn("HOUR", sequelize.col("startTime")), "ASC"]],
        raw: true,
      }),
      PageView.findAll({
        attributes: [
          [sequelize.fn("HOUR", sequelize.col("createdAt")), "hour"],
          [sequelize.fn("COUNT", sequelize.col("id")), "pageViews"],
        ],
        where: dateFilter,
        group: [sequelize.fn("HOUR", sequelize.col("createdAt"))],
        order: [[sequelize.fn("HOUR", sequelize.col("createdAt")), "ASC"]],
        raw: true,
      }),
    ]);

    // === DAILY TRENDS ===
    console.log("📊 Fetching daily trends...");

    const dailyTrends = await DailyStats.findAll({
      attributes: [
        "date",
        "totalVisitors",
        "totalPageViews",
        "uniqueVisitors",
        "newUsers",
        "bounceRate",
      ],
      where: dailyStatsDateFilter,
      order: [["date", "ASC"]],
      raw: true,
    });

    // === MONTHLY TRENDS ===
    console.log("📊 Fetching monthly trends...");

    let monthlyTrends: any[] = [];
    try {
      monthlyTrends = await DailyStats.findAll({
        attributes: [
          [
            sequelize.literal(
              "CONCAT(YEAR(`date`), '-', LPAD(MONTH(`date`), 2, '0'))"
            ),
            "month",
          ],
          [sequelize.fn("SUM", sequelize.col("totalVisitors")), "sessions"],
          [sequelize.fn("SUM", sequelize.col("totalPageViews")), "pageViews"],
          [sequelize.fn("SUM", sequelize.col("newUsers")), "newUsers"],
          [sequelize.fn("AVG", sequelize.col("bounceRate")), "avgBounceRate"],
        ],
        where: dailyStatsDateFilter,
        group: [
          sequelize.literal(
            "CONCAT(YEAR(`date`), '-', LPAD(MONTH(`date`), 2, '0'))"
          ),
        ],
        order: [
          [
            sequelize.literal(
              "CONCAT(YEAR(`date`), '-', LPAD(MONTH(`date`), 2, '0'))"
            ),
            "ASC",
          ],
        ],
        raw: true,
      });
    } catch (error) {
      console.warn("Monthly trends calculation failed:", error);
      monthlyTrends = [];
    }

    // === REALTIME STATISTICS ===
    console.log("📊 Fetching realtime statistics...");

    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const previous24h = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    const [
      activeNow,
      todaySessions,
      todayPageViews,
      todayNewUsers,
      last24hSessions,
      last24hPageViews,
      last24hUsers,
      previous24hSessions,
      previous24hPageViews,
      previous24hUsers,
    ] = await Promise.all([
      // Active sessions (last 30 minutes)
      AnalyticsSession.count({
        where: {
          [Op.or]: [
            { endTime: null },
            { endTime: { [Op.gte]: new Date(now.getTime() - 30 * 60 * 1000) } },
          ],
          startTime: { [Op.gte]: todayStart },
        },
      }),
      // Today's sessions
      AnalyticsSession.count({
        where: { createdAt: { [Op.gte]: todayStart } },
      }),
      // Today's page views
      PageView.count({
        where: { createdAt: { [Op.gte]: todayStart } },
      }),
      // Today's new users (from daily stats)
      DailyStats.sum("newUsers", {
        where: { date: { [Op.gte]: todayStart.toISOString().split("T")[0] } },
      }),
      // Last 24h sessions
      AnalyticsSession.count({
        where: { createdAt: { [Op.gte]: last24h } },
      }),
      // Last 24h page views
      PageView.count({
        where: { createdAt: { [Op.gte]: last24h } },
      }),
      // Last 24h new users
      AnalyticsSession.count({
        distinct: true,
        col: "userId",
        where: {
          createdAt: { [Op.gte]: last24h },
          userId: { [Op.not]: null },
        },
      }),
      // Previous 24h sessions
      AnalyticsSession.count({
        where: {
          createdAt: {
            [Op.gte]: previous24h,
            [Op.lt]: last24h,
          },
        },
      }),
      // Previous 24h page views
      PageView.count({
        where: {
          createdAt: {
            [Op.gte]: previous24h,
            [Op.lt]: last24h,
          },
        },
      }),
      // Previous 24h new users
      AnalyticsSession.count({
        distinct: true,
        col: "userId",
        where: {
          createdAt: {
            [Op.gte]: previous24h,
            [Op.lt]: last24h,
          },
          userId: { [Op.not]: null },
        },
      }),
    ]);

    // === CALCULATE GROWTH RATES ===
    const calculateGrowth = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    // === MERGE HOURLY ACTIVITY ===
    const mergedHourlyActivity = Array.from({ length: 24 }, (_, hour) => {
      const sessionData = hourlySessionActivity.find(
        (s: any) => s.hour === hour
      );
      const pageViewData = hourlyPageViewActivity.find(
        (p: any) => p.hour === hour
      );

      return {
        hour,
        sessions: parseInt(sessionData?.sessions || "0"),
        pageViews: parseInt(pageViewData?.pageViews || "0"),
      };
    });

    // === PREPARE RESPONSE DATA ===
    const statistics: OverallStatistics = {
      totalSessions,
      totalPageViews,
      totalUniqueVisitors,
      totalUniqueUsers,
      avgSessionDuration: parseFloat(sessionStats?.avgDuration || "0"),
      avgTimeOnPage: parseFloat(pageViewStats?.avgTimeOnPage || "0"),
      bounceRate: parseFloat(dailyStatsSummary?.avgBounceRate || "0"),
      activeSessions: activeNow,
      newUsers: parseInt(dailyStatsSummary?.totalNewUsers || "0"),
      returningUsers: parseInt(dailyStatsSummary?.totalReturningUsers || "0"),
      mobileUsers: parseInt(dailyStatsSummary?.totalMobileUsers || "0"),
      desktopUsers: parseInt(dailyStatsSummary?.totalDesktopUsers || "0"),
      botSessions: botStats.find((b: any) => b.isBot)?.count || 0,
      humanSessions: botStats.find((b: any) => !b.isBot)?.count || 0,
      topCountries: topCountries.reduce(
        (acc: Record<string, number>, item: any) => {
          acc[item.country || "Unknown"] = parseInt(item.count || "0");
          return acc;
        },
        {}
      ),
      topPages: topPages.map((page: any) => ({
        page: page.page,
        views: parseInt(page.views || "0"),
        avgTime: parseFloat(page.avgTime || "0"),
        uniqueVisitors: parseInt(page.uniqueVisitors || "0"),
      })),
      deviceBreakdown: deviceBreakdown.reduce(
        (acc: any, item: any) => {
          acc[item.deviceType] = parseInt(item.count || "0");
          return acc;
        },
        { mobile: 0, desktop: 0, tablet: 0, unknown: 0 }
      ),
      userTypeBreakdown: userTypeBreakdown.reduce(
        (acc: any, item: any) => {
          acc[item.userType] = parseInt(item.count || "0");
          return acc;
        },
        { authenticated: 0, anonymous: 0 }
      ),
      exitPageStats: exitPageStats.reduce(
        (acc: any, item: any) => {
          const key = item.exitPage ? "exitPages" : "nonExitPages";
          acc[key] = parseInt(item.count || "0");
          return acc;
        },
        { exitPages: 0, nonExitPages: 0 }
      ),
      hourlyActivity: mergedHourlyActivity,
      dailyTrends: dailyTrends.map((day: any) => ({
        date: day.date,
        sessions: parseInt(day.totalVisitors || "0"),
        pageViews: parseInt(day.totalPageViews || "0"),
        uniqueVisitors: parseInt(day.uniqueVisitors || "0"),
        newUsers: parseInt(day.newUsers || "0"),
        bounceRate: parseFloat(day.bounceRate || "0"),
      })),
      monthlyTrends: monthlyTrends.map((month: any) => ({
        month: month.month,
        sessions: parseInt(month.sessions || "0"),
        pageViews: parseInt(month.pageViews || "0"),
        newUsers: parseInt(month.newUsers || "0"),
        avgSessionDuration: parseFloat(month.avgSessionDuration || "0"),
      })),
      realtimeStats: {
        activeNow,
        todaySessions,
        todayPageViews,
        todayNewUsers: parseInt(todayNewUsers || "0"),
        last24hGrowth: {
          sessions: calculateGrowth(last24hSessions, previous24hSessions),
          pageViews: calculateGrowth(last24hPageViews, previous24hPageViews),
          users: calculateGrowth(last24hUsers, previous24hUsers),
        },
      },
    };

    console.log("✅ Comprehensive statistics retrieved successfully");

    return NextResponse.json({
      success: true,
      message: "Statistik komprehensif berhasil diambil",
      data: {
        overview: {
          totalSessions: statistics.totalSessions,
          totalPageViews: statistics.totalPageViews,
          totalUniqueVisitors: statistics.totalUniqueVisitors,
          totalUniqueUsers: statistics.totalUniqueUsers,
          totalUsers,
          avgSessionDuration: statistics.avgSessionDuration,
          avgTimeOnPage: statistics.avgTimeOnPage,
          bounceRate: statistics.bounceRate,
        },
        userStats: {
          newUsers: statistics.newUsers,
          returningUsers: statistics.returningUsers,
          userTypeBreakdown: statistics.userTypeBreakdown,
          totalUsers,
        },
        deviceStats: {
          mobileUsers: statistics.mobileUsers,
          desktopUsers: statistics.desktopUsers,
          deviceBreakdown: statistics.deviceBreakdown,
        },
        trafficStats: {
          botSessions: statistics.botSessions,
          humanSessions: statistics.humanSessions,
          topCountries: statistics.topCountries,
          exitPageStats: statistics.exitPageStats,
        },
        contentStats: {
          topPages: statistics.topPages,
          avgTimeOnPage: statistics.avgTimeOnPage,
        },
        activityStats: {
          hourlyActivity: statistics.hourlyActivity,
          dailyTrends: statistics.dailyTrends,
          monthlyTrends: statistics.monthlyTrends,
        },
        realtimeStats: statistics.realtimeStats,
        dateRange: {
          from: startDate.toISOString(),
          to: endDate.toISOString(),
          timeRange,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("💥 Error fetching comprehensive statistics:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat mengambil statistik komprehensif",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
