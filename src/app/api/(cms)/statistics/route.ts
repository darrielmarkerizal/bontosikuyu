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

// Define interfaces for query results
interface SessionStatsResult {
  avgDuration: string;
  totalSessions: string;
}

interface PageViewStatsResult {
  avgTimeOnPage: string;
  totalViews: string;
}

interface DailyStatsSummaryResult {
  totalNewUsers: string;
  totalReturningUsers: string;
  totalMobileUsers: string;
  totalDesktopUsers: string;
  avgBounceRate: string;
}

interface DeviceBreakdownResult {
  deviceType: string;
  count: string;
}

interface UserTypeBreakdownResult {
  userType: string;
  count: string;
}

interface BotStatsResult {
  isBot: boolean;
  count: string;
}

interface CountryStatsResult {
  country: string;
  count: string;
}

interface TopPageResult {
  page: string;
  views: string;
  avgTime: string;
  uniqueVisitors: string;
}

interface ExitPageStatsResult {
  exitPage: boolean;
  count: string;
}

interface HourlyActivityResult {
  hour: number;
  sessions: string;
  pageViews: string;
}

interface DailyTrendResult {
  date: string;
  totalVisitors: number;
  totalPageViews: number;
  uniqueVisitors: number;
  newUsers: number;
  bounceRate: number;
}

interface MonthlyTrendResult {
  month: string;
  sessions: string;
  pageViews: string;
  newUsers: string;
  avgBounceRate: string;
}

interface BrowserStatsResult {
  browser: string;
  count: string;
}

interface OsStatsResult {
  os: string;
  count: string;
}

interface ReferrerStatsResult {
  referrer: string;
  count: string;
}

interface LandingPageStatsResult {
  landingPage: string;
  sessions: string;
  uniqueVisitors: string;
}

interface SessionDurationStatsResult {
  minDuration: string;
  maxDuration: string;
  avgDuration: string;
}

interface DurationDistributionResult {
  range: string;
  count: string;
}

interface PageTitleResult {
  title: string;
  views: string;
}

interface CityStatsResult {
  city: string;
  count: string;
}

interface WeeklyPatternResult {
  dayOfWeek: number;
  sessions: string;
  pageViews: string;
}

// Helper function to safely build device breakdown with proper typing
function buildDeviceBreakdown(deviceData: DeviceBreakdownResult[]): {
  mobile: number;
  desktop: number;
  tablet: number;
  unknown: number;
} {
  const breakdown = {
    mobile: 0,
    desktop: 0,
    tablet: 0,
    unknown: 0,
  };

  deviceData.forEach((item) => {
    const deviceType = item.deviceType as keyof typeof breakdown;
    if (deviceType in breakdown) {
      breakdown[deviceType] = parseInt(item.count || "0");
    } else {
      breakdown.unknown += parseInt(item.count || "0");
    }
  });

  return breakdown;
}

// Helper function to safely build user type breakdown with proper typing
function buildUserTypeBreakdown(userData: UserTypeBreakdownResult[]): {
  authenticated: number;
  anonymous: number;
} {
  const breakdown = {
    authenticated: 0,
    anonymous: 0,
  };

  userData.forEach((item) => {
    const userType = item.userType as keyof typeof breakdown;
    if (userType in breakdown) {
      breakdown[userType] = parseInt(item.count || "0");
    }
  });

  return breakdown;
}

// Helper function to safely build exit page stats with proper typing
function buildExitPageStats(exitData: ExitPageStatsResult[]): {
  exitPages: number;
  nonExitPages: number;
} {
  const stats = {
    exitPages: 0,
    nonExitPages: 0,
  };

  exitData.forEach((item) => {
    if (item.exitPage) {
      stats.exitPages = parseInt(item.count || "0");
    } else {
      stats.nonExitPages = parseInt(item.count || "0");
    }
  });

  return stats;
}

// Helper function to load models and database
async function loadModels() {
  /* eslint-disable @typescript-eslint/no-require-imports */
  const sequelize = require("../../../../../config/database");
  const { DataTypes } = require("sequelize");

  const AnalyticsSession = require("../../../../../models/analyticssession.js")(
    sequelize,
    DataTypes
  );
  const PageView = require("../../../../../models/pageview.js")(
    sequelize,
    DataTypes
  );
  const DailyStats = require("../../../../../models/dailystats.js")(
    sequelize,
    DataTypes
  );
  const User = require("../../../../../models/user.js")(sequelize, DataTypes);
  /* eslint-enable @typescript-eslint/no-require-imports */

  return { sequelize, AnalyticsSession, PageView, DailyStats, User };
}

// GET - Get comprehensive statistics summary
export async function GET(request: NextRequest) {
  try {
    console.log("📊 Getting comprehensive statistics data");

    // Load models and database connection
    const { sequelize, AnalyticsSession, PageView, DailyStats, User } =
      await loadModels();

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

    const sessionStats = (await AnalyticsSession.findOne({
      attributes: [
        [sequelize.fn("AVG", sequelize.col("duration")), "avgDuration"],
        [sequelize.fn("COUNT", sequelize.col("id")), "totalSessions"],
      ],
      where: {
        ...dateFilter,
        duration: { [Op.not]: null },
      },
      raw: true,
    })) as SessionStatsResult | null;

    // === PAGE VIEW STATISTICS ===
    console.log("📊 Fetching page view statistics...");

    const pageViewStats = (await PageView.findOne({
      attributes: [
        [sequelize.fn("AVG", sequelize.col("timeOnPage")), "avgTimeOnPage"],
        [sequelize.fn("COUNT", sequelize.col("id")), "totalViews"],
      ],
      where: {
        ...dateFilter,
        timeOnPage: { [Op.not]: null },
      },
      raw: true,
    })) as PageViewStatsResult | null;

    // === DAILY STATS SUMMARY ===
    console.log("📊 Fetching daily stats summary...");

    const dailyStatsSummary = (await DailyStats.findOne({
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
    })) as DailyStatsSummaryResult | null;

    // === DEVICE BREAKDOWN ===
    console.log("📊 Fetching device breakdown...");

    const deviceBreakdown = (await AnalyticsSession.findAll({
      attributes: [
        "deviceType",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: dateFilter,
      group: ["deviceType"],
      raw: true,
    })) as DeviceBreakdownResult[];

    // === USER TYPE BREAKDOWN ===
    console.log("📊 Fetching user type breakdown...");

    const userTypeBreakdown = (await AnalyticsSession.findAll({
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
    })) as UserTypeBreakdownResult[];

    // === BOT STATISTICS ===
    console.log("📊 Fetching bot statistics...");

    const botStats = (await AnalyticsSession.findAll({
      attributes: [
        "isBot",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: dateFilter,
      group: ["isBot"],
      raw: true,
    })) as BotStatsResult[];

    // === TOP COUNTRIES ===
    console.log("📊 Fetching top countries...");

    const topCountries = (await AnalyticsSession.findAll({
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
    })) as CountryStatsResult[];

    // === TOP PAGES ===
    console.log("📊 Fetching top pages...");

    const topPages = (await PageView.findAll({
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
    })) as TopPageResult[];

    // === EXIT PAGE STATISTICS ===
    console.log("📊 Fetching exit page statistics...");

    const exitPageStats = (await PageView.findAll({
      attributes: [
        "exitPage",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: dateFilter,
      group: ["exitPage"],
      raw: true,
    })) as ExitPageStatsResult[];

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
      }) as Promise<HourlyActivityResult[]>,
      PageView.findAll({
        attributes: [
          [sequelize.fn("HOUR", sequelize.col("createdAt")), "hour"],
          [sequelize.fn("COUNT", sequelize.col("id")), "pageViews"],
        ],
        where: dateFilter,
        group: [sequelize.fn("HOUR", sequelize.col("createdAt"))],
        order: [[sequelize.fn("HOUR", sequelize.col("createdAt")), "ASC"]],
        raw: true,
      }) as Promise<HourlyActivityResult[]>,
    ]);

    // === DAILY TRENDS ===
    console.log("📊 Fetching daily trends...");

    const dailyTrends = (await DailyStats.findAll({
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
    })) as DailyTrendResult[];

    // === MONTHLY TRENDS ===
    console.log("📊 Fetching monthly trends...");

    let monthlyTrends: MonthlyTrendResult[] = [];
    try {
      monthlyTrends = (await DailyStats.findAll({
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
      })) as MonthlyTrendResult[];
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
        (s: HourlyActivityResult) => s.hour === hour
      );
      const pageViewData = hourlyPageViewActivity.find(
        (p: HourlyActivityResult) => p.hour === hour
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
      botSessions: parseInt(
        botStats.find((b: BotStatsResult) => b.isBot)?.count || "0"
      ),
      humanSessions: parseInt(
        botStats.find((b: BotStatsResult) => !b.isBot)?.count || "0"
      ),
      topCountries: topCountries.reduce(
        (acc: Record<string, number>, item: CountryStatsResult) => {
          acc[item.country || "Unknown"] = parseInt(item.count || "0");
          return acc;
        },
        {}
      ),
      topPages: topPages.map((page: TopPageResult) => ({
        page: page.page,
        views: parseInt(page.views || "0"),
        avgTime: parseFloat(page.avgTime || "0"),
        uniqueVisitors: parseInt(page.uniqueVisitors || "0"),
      })),
      // Use helper functions for proper typing
      deviceBreakdown: buildDeviceBreakdown(deviceBreakdown),
      userTypeBreakdown: buildUserTypeBreakdown(userTypeBreakdown),
      exitPageStats: buildExitPageStats(exitPageStats),
      hourlyActivity: mergedHourlyActivity,
      dailyTrends: dailyTrends.map((day: DailyTrendResult) => ({
        date: day.date,
        sessions: parseInt(day.totalVisitors?.toString() || "0"),
        pageViews: parseInt(day.totalPageViews?.toString() || "0"),
        uniqueVisitors: parseInt(day.uniqueVisitors?.toString() || "0"),
        newUsers: parseInt(day.newUsers?.toString() || "0"),
        bounceRate: parseFloat(day.bounceRate?.toString() || "0"),
      })),
      monthlyTrends: monthlyTrends.map((month: MonthlyTrendResult) => ({
        month: month.month,
        sessions: parseInt(month.sessions || "0"),
        pageViews: parseInt(month.pageViews || "0"),
        newUsers: parseInt(month.newUsers || "0"),
        avgSessionDuration: parseFloat(month.avgBounceRate || "0"),
      })),
      realtimeStats: {
        activeNow,
        todaySessions,
        todayPageViews,
        todayNewUsers: parseInt(todayNewUsers?.toString() || "0"),
        last24hGrowth: {
          sessions: calculateGrowth(last24hSessions, previous24hSessions),
          pageViews: calculateGrowth(last24hPageViews, previous24hPageViews),
          users: calculateGrowth(last24hUsers, previous24hUsers),
        },
      },
    };

    // === BROWSER STATISTICS ===
    console.log("📊 Fetching browser statistics...");

    const browserStats = (await AnalyticsSession.findAll({
      attributes: [
        "browser",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: {
        ...dateFilter,
        browser: { [Op.not]: null },
      },
      group: ["browser"],
      order: [[sequelize.fn("COUNT", sequelize.col("id")), "DESC"]],
      limit: 10,
      raw: true,
    })) as BrowserStatsResult[];

    // === OS STATISTICS ===
    console.log("📊 Fetching OS statistics...");

    const osStats = (await AnalyticsSession.findAll({
      attributes: ["os", [sequelize.fn("COUNT", sequelize.col("id")), "count"]],
      where: {
        ...dateFilter,
        os: { [Op.not]: null },
      },
      group: ["os"],
      order: [[sequelize.fn("COUNT", sequelize.col("id")), "DESC"]],
      limit: 10,
      raw: true,
    })) as OsStatsResult[];

    // === REFERRER STATISTICS ===
    console.log("📊 Fetching referrer statistics...");

    const referrerStats = (await AnalyticsSession.findAll({
      attributes: [
        "referrer",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: {
        ...dateFilter,
        referrer: { [Op.not]: null },
      },
      group: ["referrer"],
      order: [[sequelize.fn("COUNT", sequelize.col("id")), "DESC"]],
      limit: 10,
      raw: true,
    })) as ReferrerStatsResult[];

    // === LANDING PAGE STATISTICS ===
    console.log("📊 Fetching landing page statistics...");

    const landingPageStats = (await AnalyticsSession.findAll({
      attributes: [
        "landingPage",
        [sequelize.fn("COUNT", sequelize.col("id")), "sessions"],
        [
          sequelize.fn("COUNT", sequelize.literal("DISTINCT ipAddress")),
          "uniqueVisitors",
        ],
      ],
      where: dateFilter,
      group: ["landingPage"],
      order: [[sequelize.fn("COUNT", sequelize.col("id")), "DESC"]],
      limit: 10,
      raw: true,
    })) as LandingPageStatsResult[];

    // === SESSION DURATION STATISTICS ===
    console.log("📊 Fetching session duration statistics...");

    const sessionDurationStats = (await AnalyticsSession.findOne({
      attributes: [
        [sequelize.fn("MIN", sequelize.col("duration")), "minDuration"],
        [sequelize.fn("MAX", sequelize.col("duration")), "maxDuration"],
        [sequelize.fn("AVG", sequelize.col("duration")), "avgDuration"],
      ],
      where: {
        ...dateFilter,
        duration: { [Op.not]: null },
      },
      raw: true,
    })) as SessionDurationStatsResult | null;

    // Session duration distribution
    const durationDistribution = (await AnalyticsSession.findAll({
      attributes: [
        [
          sequelize.literal(`
            CASE 
              WHEN duration < 30 THEN '0-30s'
              WHEN duration < 60 THEN '30-60s'
              WHEN duration < 180 THEN '1-3m'
              WHEN duration < 600 THEN '3-10m'
              WHEN duration < 1800 THEN '10-30m'
              ELSE '30m+'
            END
          `),
          "range",
        ],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: {
        ...dateFilter,
        duration: { [Op.not]: null },
      },
      group: [
        sequelize.literal(`
          CASE 
            WHEN duration < 30 THEN '0-30s'
            WHEN duration < 60 THEN '30-60s'
            WHEN duration < 180 THEN '1-3m'
            WHEN duration < 600 THEN '3-10m'
            WHEN duration < 1800 THEN '10-30m'
            ELSE '30m+'
          END
        `),
      ],
      raw: true,
    })) as DurationDistributionResult[];

    // === PAGE TITLE STATISTICS ===
    console.log("📊 Fetching page title statistics...");

    const topPageTitles = (await PageView.findAll({
      attributes: [
        "title",
        [sequelize.fn("COUNT", sequelize.col("id")), "views"],
      ],
      where: {
        ...dateFilter,
        title: { [Op.not]: null },
      },
      group: ["title"],
      order: [[sequelize.fn("COUNT", sequelize.col("id")), "DESC"]],
      limit: 10,
      raw: true,
    })) as PageTitleResult[];

    const totalPageTitles = await PageView.count({
      distinct: true,
      col: "title",
      where: {
        ...dateFilter,
        title: { [Op.not]: null },
      },
    });

    // === GEOGRAPHIC STATISTICS ===
    console.log("📊 Fetching geographic statistics...");

    const topCities = (await AnalyticsSession.findAll({
      attributes: [
        "city",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: {
        ...dateFilter,
        city: { [Op.not]: null },
      },
      group: ["city"],
      order: [[sequelize.fn("COUNT", sequelize.col("id")), "DESC"]],
      limit: 10,
      raw: true,
    })) as CityStatsResult[];

    const [totalCountries, totalCities] = await Promise.all([
      AnalyticsSession.count({
        distinct: true,
        col: "country",
        where: {
          ...dateFilter,
          country: { [Op.not]: null },
        },
      }),
      AnalyticsSession.count({
        distinct: true,
        col: "city",
        where: {
          ...dateFilter,
          city: { [Op.not]: null },
        },
      }),
    ]);

    // === WEEKLY PATTERNS ===
    console.log("📊 Fetching weekly patterns...");

    const weeklyPatterns = (await AnalyticsSession.findAll({
      attributes: [
        [sequelize.fn("DAYOFWEEK", sequelize.col("startTime")), "dayOfWeek"],
        [sequelize.fn("COUNT", sequelize.col("id")), "sessions"],
      ],
      where: dateFilter,
      group: [sequelize.fn("DAYOFWEEK", sequelize.col("startTime"))],
      order: [[sequelize.fn("DAYOFWEEK", sequelize.col("startTime")), "ASC"]],
      raw: true,
    })) as WeeklyPatternResult[];

    const weeklyPageViews = (await PageView.findAll({
      attributes: [
        [sequelize.fn("DAYOFWEEK", sequelize.col("createdAt")), "dayOfWeek"],
        [sequelize.fn("COUNT", sequelize.col("id")), "pageViews"],
      ],
      where: dateFilter,
      group: [sequelize.fn("DAYOFWEEK", sequelize.col("createdAt"))],
      order: [[sequelize.fn("DAYOFWEEK", sequelize.col("createdAt")), "ASC"]],
      raw: true,
    })) as WeeklyPatternResult[];

    // === PERFORMANCE METRICS ===
    console.log("📊 Calculating performance metrics...");

    const daysDifference = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const avgVisitorsPerDay = totalUniqueVisitors / Math.max(daysDifference, 1);
    const avgPageViewsPerDay = totalPageViews / Math.max(daysDifference, 1);
    const avgSessionsPerDay = totalSessions / Math.max(daysDifference, 1);

    // Find peak hour
    const peakHourData = mergedHourlyActivity.reduce((max, current) =>
      current.sessions > max.sessions ? current : max
    );

    // Find peak day - Fix: use totalVisitors from DailyTrendResult
    const peakDayData =
      dailyTrends.length > 0
        ? dailyTrends.reduce((max, current) =>
            current.totalVisitors > max.totalVisitors ? current : max
          )
        : null;

    // Calculate average pages per session
    const avgPagesPerSession = totalPageViews / Math.max(totalSessions, 1);

    // === PREPARE EXTENDED RESPONSE DATA ===
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const mergedWeeklyPatterns = Array.from({ length: 7 }, (_, index) => {
      const dayOfWeek = index + 1; // MySQL DAYOFWEEK starts from 1 (Sunday)
      const sessionData = weeklyPatterns.find(
        (p: WeeklyPatternResult) => p.dayOfWeek === dayOfWeek
      );
      const pageViewData = weeklyPageViews.find(
        (p: WeeklyPatternResult) => p.dayOfWeek === dayOfWeek
      );

      return {
        dayOfWeek,
        dayName: dayNames[index],
        sessions: parseInt(sessionData?.sessions || "0"),
        pageViews: parseInt(pageViewData?.pageViews || "0"),
      };
    });

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

        // Extended sections
        browserStats: browserStats.reduce(
          (acc: Record<string, number>, item: BrowserStatsResult) => {
            acc[item.browser || "Unknown"] = parseInt(item.count || "0");
            return acc;
          },
          {}
        ),
        osStats: osStats.reduce(
          (acc: Record<string, number>, item: OsStatsResult) => {
            acc[item.os || "Unknown"] = parseInt(item.count || "0");
            return acc;
          },
          {}
        ),
        referrerStats: referrerStats.reduce(
          (acc: Record<string, number>, item: ReferrerStatsResult) => {
            acc[item.referrer || "Direct"] = parseInt(item.count || "0");
            return acc;
          },
          {}
        ),
        landingPageStats: landingPageStats.map(
          (page: LandingPageStatsResult) => ({
            page: page.landingPage,
            sessions: parseInt(page.sessions || "0"),
            uniqueVisitors: parseInt(page.uniqueVisitors || "0"),
          })
        ),
        sessionMetrics: {
          minDuration: parseInt(sessionDurationStats?.minDuration || "0"),
          maxDuration: parseInt(sessionDurationStats?.maxDuration || "0"),
          avgDuration: parseFloat(sessionDurationStats?.avgDuration || "0"),
          durationDistribution: durationDistribution.map(
            (dist: DurationDistributionResult) => ({
              range: dist.range,
              count: parseInt(dist.count || "0"),
            })
          ),
        },
        pageMetrics: {
          totalPageTitles,
          avgPagesPerSession: parseFloat(avgPagesPerSession.toFixed(2)),
          topPageTitles: topPageTitles.map((title: PageTitleResult) => ({
            title: title.title,
            views: parseInt(title.views || "0"),
          })),
        },
        performanceMetrics: {
          avgVisitorsPerDay: parseFloat(avgVisitorsPerDay.toFixed(2)),
          avgPageViewsPerDay: parseFloat(avgPageViewsPerDay.toFixed(2)),
          avgSessionsPerDay: parseFloat(avgSessionsPerDay.toFixed(2)),
          peakHour: peakHourData.hour,
          peakDay: peakDayData?.date || "N/A",
        },
        geographicStats: {
          totalCountries,
          totalCities,
          topCities: topCities.reduce(
            (acc: Record<string, number>, item: CityStatsResult) => {
              acc[item.city || "Unknown"] = parseInt(item.count || "0");
              return acc;
            },
            {}
          ),
        },
        temporalPatterns: {
          weeklyPatterns: mergedWeeklyPatterns,
          seasonalTrends: {
            currentPeriod: {
              sessions: totalSessions,
              pageViews: totalPageViews,
              uniqueVisitors: totalUniqueVisitors,
            },
          },
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
