import { NextRequest, NextResponse } from "next/server";
import { Op, fn, col, literal } from "sequelize";

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";

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
interface SequelizeModel {
  dataValues?: Record<string, unknown>;
  [key: string]: unknown;
}

interface SessionStatsResult extends SequelizeModel {
  totalSessions?: number | string;
  totalUniqueVisitors?: number | string;
  avgSessionDuration?: number | string;
  totalUniqueUsers?: number | string;
}

interface PageViewStatsResult extends SequelizeModel {
  totalPageViews?: number | string;
  avgTimeOnPage?: number | string;
}

interface BreakdownStatsResult extends SequelizeModel {
  deviceType?: string;
  isBot?: boolean;
  userType?: string;
  count?: number | string;
}

interface GeographicStatsResult extends SequelizeModel {
  country?: string;
  city?: string;
  count?: number | string;
  totalCountries?: number | string;
  totalCities?: number | string;
}

interface ActivityStatsResult extends SequelizeModel {
  hour?: number;
  dayOfWeek?: number;
  sessions?: number | string;
  pageViews?: number | string;
}

interface ContentStatsResult extends SequelizeModel {
  page?: string;
  title?: string;
  views?: number | string;
  avgTime?: number | string;
  uniqueVisitors?: number | string;
  exitPage?: boolean;
  browser?: string;
  os?: string;
  count?: number | string;
}

interface DailyTrendResult extends SequelizeModel {
  date?: string;
  totalVisitors?: number | string;
  totalPageViews?: number | string;
  uniqueVisitors?: number | string;
  newUsers?: number | string;
  bounceRate?: number | string;
}

interface MonthlyTrendResult extends SequelizeModel {
  month?: string;
  sessions?: number | string;
  pageViews?: number | string;
  newUsers?: number | string;
  avgBounceRate?: number | string;
}

interface RealtimeStatsResult extends SequelizeModel {
  todaySessions?: number | string;
  todayPageViews?: number | string;
  last24hSessions?: number | string;
  previous24hSessions?: number | string;
  last24hPageViews?: number | string;
  previous24hPageViews?: number | string;
}

interface ModelInstance {
  findOne: (options: unknown) => Promise<SequelizeModel | null>;
  findAll: (options: unknown) => Promise<SequelizeModel[]>;
  count: (options?: unknown) => Promise<number>;
  sum: (field: string, options?: unknown) => Promise<number | null>;
}

// Helper function to load models
async function loadModels() {
  /* eslint-disable @typescript-eslint/no-require-imports */
  const sequelize = require("../../../../../config/database");
  const { DataTypes } = require("sequelize");

  const AnalyticsSession = require("../../../../../models/analyticssession.js")(
    sequelize,
    DataTypes
  ) as ModelInstance;
  const PageView = require("../../../../../models/pageview.js")(
    sequelize,
    DataTypes
  ) as ModelInstance;
  const DailyStats = require("../../../../../models/dailystats.js")(
    sequelize,
    DataTypes
  ) as ModelInstance;
  const User = require("../../../../../models/user.js")(
    sequelize,
    DataTypes
  ) as ModelInstance;
  /* eslint-enable @typescript-eslint/no-require-imports */

  return { sequelize, AnalyticsSession, PageView, DailyStats, User };
}

// Helper function to calculate date range
function calculateDateRange(
  timeRange: string,
  dateFrom?: string,
  dateTo?: string
) {
  let startDate = new Date();
  let endDate = new Date();

  if (dateFrom && dateTo) {
    startDate = new Date(dateFrom);
    endDate = new Date(dateTo);
  } else {
    const timeRangeMap: Record<string, number> = {
      "1d": 1,
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "1y": 365,
    };

    const days = timeRangeMap[timeRange] || 30;
    startDate.setDate(startDate.getDate() - days);
  }

  return { startDate, endDate };
}

// Helper function to safely extract value
function extractValue(
  obj: SequelizeModel | null | undefined,
  key: string
): string {
  if (!obj) return "0";
  return String(obj.dataValues?.[key] ?? obj[key] ?? "0");
}

// Optimized function to get basic counts in one query
async function getBasicCounts(
  AnalyticsSession: ModelInstance,
  PageView: ModelInstance,
  User: ModelInstance,
  dateFilter: Record<string, unknown>
): Promise<[SessionStatsResult | null, PageViewStatsResult | null, number]> {
  return Promise.all([
    // Session counts with aggregations in one query
    AnalyticsSession.findOne({
      attributes: [
        [fn("COUNT", col("id")), "totalSessions"],
        [fn("COUNT", fn("DISTINCT", col("ipAddress"))), "totalUniqueVisitors"],
        [fn("AVG", col("duration")), "avgSessionDuration"],
        [fn("COUNT", fn("DISTINCT", col("userId"))), "totalUniqueUsers"],
      ],
      where: dateFilter,
    }) as Promise<SessionStatsResult | null>,
    // Page view counts with aggregations
    PageView.findOne({
      attributes: [
        [fn("COUNT", col("id")), "totalPageViews"],
        [fn("AVG", col("timeOnPage")), "avgTimeOnPage"],
      ],
      where: dateFilter,
    }) as Promise<PageViewStatsResult | null>,
    // Total users (cached or separate query)
    User.count(),
  ]);
}

// Optimized function to get device and user type breakdown in one query
async function getBreakdownStats(
  AnalyticsSession: ModelInstance,
  dateFilter: Record<string, unknown>
): Promise<BreakdownStatsResult[]> {
  return AnalyticsSession.findAll({
    attributes: [
      "deviceType",
      "isBot",
      [
        literal(
          `CASE WHEN "userId" IS NOT NULL THEN 'authenticated' ELSE 'anonymous' END`
        ),
        "userType",
      ],
      [fn("COUNT", col("id")), "count"],
    ],
    where: dateFilter,
    group: [
      "deviceType",
      "isBot",
      literal(
        `CASE WHEN "userId" IS NOT NULL THEN 'authenticated' ELSE 'anonymous' END`
      ),
    ],
  }) as Promise<BreakdownStatsResult[]>;
}

// Optimized function to get geographic stats
async function getGeographicStats(
  AnalyticsSession: ModelInstance,
  dateFilter: Record<string, unknown>
): Promise<
  [
    GeographicStatsResult[],
    GeographicStatsResult[],
    GeographicStatsResult | null,
  ]
> {
  return Promise.all([
    // Top countries with counts
    AnalyticsSession.findAll({
      attributes: ["country", [fn("COUNT", col("id")), "count"]],
      where: {
        ...dateFilter,
        country: { [Op.not]: null },
      },
      group: ["country"],
      order: [[fn("COUNT", col("id")), "DESC"]],
      limit: 10,
    }) as Promise<GeographicStatsResult[]>,
    // Top cities with counts
    AnalyticsSession.findAll({
      attributes: ["city", [fn("COUNT", col("id")), "count"]],
      where: {
        ...dateFilter,
        city: { [Op.not]: null },
      },
      group: ["city"],
      order: [[fn("COUNT", col("id")), "DESC"]],
      limit: 10,
    }) as Promise<GeographicStatsResult[]>,
    // Total unique countries and cities
    AnalyticsSession.findOne({
      attributes: [
        [fn("COUNT", fn("DISTINCT", col("country"))), "totalCountries"],
        [fn("COUNT", fn("DISTINCT", col("city"))), "totalCities"],
      ],
      where: {
        ...dateFilter,
        country: { [Op.not]: null },
        city: { [Op.not]: null },
      },
    }) as Promise<GeographicStatsResult | null>,
  ]);
}

// Optimized function to get activity patterns
async function getActivityPatterns(
  AnalyticsSession: ModelInstance,
  PageView: ModelInstance,
  dateFilter: Record<string, unknown>
): Promise<
  [
    ActivityStatsResult[],
    ActivityStatsResult[],
    ActivityStatsResult[],
    ActivityStatsResult[],
  ]
> {
  return Promise.all([
    // Hourly activity for sessions
    AnalyticsSession.findAll({
      attributes: [
        [fn("HOUR", col("startTime")), "hour"],
        [fn("COUNT", col("id")), "sessions"],
      ],
      where: dateFilter,
      group: [fn("HOUR", col("startTime"))],
      order: [[fn("HOUR", col("startTime")), "ASC"]],
    }) as Promise<ActivityStatsResult[]>,
    // Hourly activity for page views
    PageView.findAll({
      attributes: [
        [fn("HOUR", col("createdAt")), "hour"],
        [fn("COUNT", col("id")), "pageViews"],
      ],
      where: dateFilter,
      group: [fn("HOUR", col("createdAt"))],
      order: [[fn("HOUR", col("createdAt")), "ASC"]],
    }) as Promise<ActivityStatsResult[]>,
    // Weekly patterns for sessions
    AnalyticsSession.findAll({
      attributes: [
        [fn("DAYOFWEEK", col("startTime")), "dayOfWeek"],
        [fn("COUNT", col("id")), "sessions"],
      ],
      where: dateFilter,
      group: [fn("DAYOFWEEK", col("startTime"))],
      order: [[fn("DAYOFWEEK", col("startTime")), "ASC"]],
    }) as Promise<ActivityStatsResult[]>,
    // Weekly patterns for page views
    PageView.findAll({
      attributes: [
        [fn("DAYOFWEEK", col("createdAt")), "dayOfWeek"],
        [fn("COUNT", col("id")), "pageViews"],
      ],
      where: dateFilter,
      group: [fn("DAYOFWEEK", col("createdAt"))],
      order: [[fn("DAYOFWEEK", col("createdAt")), "ASC"]],
    }) as Promise<ActivityStatsResult[]>,
  ]);
}

// Optimized function to get content stats
async function getContentStats(
  PageView: ModelInstance,
  AnalyticsSession: ModelInstance,
  dateFilter: Record<string, unknown>
): Promise<[ContentStatsResult[], ContentStatsResult[], ContentStatsResult[]]> {
  return Promise.all([
    // Top pages with all metrics in one query
    PageView.findAll({
      attributes: [
        "page",
        [fn("COUNT", col("id")), "views"],
        [fn("AVG", col("timeOnPage")), "avgTime"],
        [fn("COUNT", fn("DISTINCT", col("sessionId"))), "uniqueVisitors"],
      ],
      where: dateFilter,
      group: ["page"],
      order: [[fn("COUNT", col("id")), "DESC"]],
      limit: 10,
    }) as Promise<ContentStatsResult[]>,
    // Exit page statistics
    PageView.findAll({
      attributes: ["exitPage", [fn("COUNT", col("id")), "count"]],
      where: dateFilter,
      group: ["exitPage"],
    }) as Promise<ContentStatsResult[]>,
    // Browser and OS stats
    AnalyticsSession.findAll({
      attributes: ["browser", "os", [fn("COUNT", col("id")), "count"]],
      where: {
        ...dateFilter,
        browser: { [Op.not]: null },
        os: { [Op.not]: null },
      },
      group: ["browser", "os"],
      order: [[fn("COUNT", col("id")), "DESC"]],
      limit: 20,
    }) as Promise<ContentStatsResult[]>,
  ]);
}

// Optimized function to get realtime stats
async function getRealtimeStats(
  AnalyticsSession: ModelInstance,
  PageView: ModelInstance,
  now: Date
): Promise<
  [
    number,
    RealtimeStatsResult | null,
    RealtimeStatsResult | null,
    RealtimeStatsResult | null,
    RealtimeStatsResult | null,
    RealtimeStatsResult | null,
    RealtimeStatsResult | null,
  ]
> {
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const previous24h = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  return Promise.all([
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
    // Today's metrics in one query
    AnalyticsSession.findOne({
      attributes: [[fn("COUNT", col("id")), "todaySessions"]],
      where: { createdAt: { [Op.gte]: todayStart } },
    }) as Promise<RealtimeStatsResult | null>,
    PageView.findOne({
      attributes: [[fn("COUNT", col("id")), "todayPageViews"]],
      where: { createdAt: { [Op.gte]: todayStart } },
    }) as Promise<RealtimeStatsResult | null>,
    // Growth comparison metrics
    AnalyticsSession.findOne({
      attributes: [[fn("COUNT", col("id")), "last24hSessions"]],
      where: { createdAt: { [Op.gte]: last24h } },
    }) as Promise<RealtimeStatsResult | null>,
    AnalyticsSession.findOne({
      attributes: [[fn("COUNT", col("id")), "previous24hSessions"]],
      where: {
        createdAt: {
          [Op.gte]: previous24h,
          [Op.lt]: last24h,
        },
      },
    }) as Promise<RealtimeStatsResult | null>,
    PageView.findOne({
      attributes: [[fn("COUNT", col("id")), "last24hPageViews"]],
      where: { createdAt: { [Op.gte]: last24h } },
    }) as Promise<RealtimeStatsResult | null>,
    PageView.findOne({
      attributes: [[fn("COUNT", col("id")), "previous24hPageViews"]],
      where: {
        createdAt: {
          [Op.gte]: previous24h,
          [Op.lt]: last24h,
        },
      },
    }) as Promise<RealtimeStatsResult | null>,
  ]);
}

// Helper function to process breakdown data
function processBreakdownData(breakdownStats: BreakdownStatsResult[]) {
  const deviceBreakdown = { mobile: 0, desktop: 0, tablet: 0, unknown: 0 };
  const userTypeBreakdown = { authenticated: 0, anonymous: 0 };
  let botSessions = 0;
  let humanSessions = 0;

  breakdownStats.forEach((stat) => {
    const count = parseInt(extractValue(stat, "count"));

    // Device breakdown
    const deviceType = extractValue(stat, "deviceType");
    if (deviceType && deviceBreakdown.hasOwnProperty(deviceType)) {
      deviceBreakdown[deviceType as keyof typeof deviceBreakdown] += count;
    } else if (deviceType && deviceType !== "0") {
      deviceBreakdown.unknown += count;
    }

    // User type breakdown
    const userType = extractValue(stat, "userType");
    if (userType && userTypeBreakdown.hasOwnProperty(userType)) {
      userTypeBreakdown[userType as keyof typeof userTypeBreakdown] += count;
    }

    // Bot stats
    const isBot =
      stat.dataValues?.isBot !== undefined ? stat.dataValues.isBot : stat.isBot;
    if (isBot === true) {
      botSessions += count;
    } else if (isBot === false) {
      humanSessions += count;
    }
  });

  return { deviceBreakdown, userTypeBreakdown, botSessions, humanSessions };
}

// Helper function to merge hourly data
function mergeHourlyData(
  sessionData: ActivityStatsResult[],
  pageViewData: ActivityStatsResult[]
) {
  return Array.from({ length: 24 }, (_, hour) => {
    const sessionStat = sessionData.find(
      (s) => parseInt(extractValue(s, "hour")) === hour
    );
    const pageViewStat = pageViewData.find(
      (p) => parseInt(extractValue(p, "hour")) === hour
    );

    return {
      hour,
      sessions: parseInt(extractValue(sessionStat, "sessions")),
      pageViews: parseInt(extractValue(pageViewStat, "pageViews")),
    };
  });
}

// Helper function to merge weekly data
function mergeWeeklyData(
  sessionData: ActivityStatsResult[],
  pageViewData: ActivityStatsResult[]
) {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return Array.from({ length: 7 }, (_, index) => {
    const dayOfWeek = index + 1;
    const sessionStat = sessionData.find(
      (s) => parseInt(extractValue(s, "dayOfWeek")) === dayOfWeek
    );
    const pageViewStat = pageViewData.find(
      (p) => parseInt(extractValue(p, "dayOfWeek")) === dayOfWeek
    );

    return {
      dayOfWeek,
      dayName: dayNames[index],
      sessions: parseInt(extractValue(sessionStat, "sessions")),
      pageViews: parseInt(extractValue(pageViewStat, "pageViews")),
    };
  });
}

// Main GET function
export async function GET(request: NextRequest) {
  try {
    console.log("📊 Getting optimized comprehensive statistics");
    const startTime = Date.now();

    // Load models
    const { sequelize, AnalyticsSession, PageView, DailyStats, User } =
      await loadModels();

    // Test database connection
    try {
      await sequelize.authenticate();
      console.log("✅ Database connection established");
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

    // Parse query parameters safely
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const timeRange = searchParams.get("timeRange") || "30d";

    // Calculate date range
    const { startDate, endDate } = calculateDateRange(
      timeRange,
      dateFrom || undefined,
      dateTo || undefined
    );

    console.log("📅 Date range:", { startDate, endDate, timeRange });

    // Define filters
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

    // Execute optimized parallel queries
    console.log("⚡ Executing optimized parallel queries...");

    const [
      [sessionStats, pageViewStats, totalUsers],
      breakdownStats,
      [topCountries, topCities, geographicTotals],
      [
        hourlySessionActivity,
        hourlyPageViewActivity,
        weeklySessionPatterns,
        weeklyPageViewPatterns,
      ],
      [topPages, exitPageStats, browserOsStats],
      dailyTrends,
      monthlyTrends,
      realtimeResults,
    ] = await Promise.all([
      // Basic counts and aggregations
      getBasicCounts(AnalyticsSession, PageView, User, dateFilter),

      // Device, user type, and bot breakdown
      getBreakdownStats(AnalyticsSession, dateFilter),

      // Geographic statistics
      getGeographicStats(AnalyticsSession, dateFilter),

      // Activity patterns
      getActivityPatterns(AnalyticsSession, PageView, dateFilter),

      // Content statistics
      getContentStats(PageView, AnalyticsSession, dateFilter),

      // Daily trends
      DailyStats.findAll({
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
      }) as Promise<DailyTrendResult[]>,

      // Monthly trends (with try-catch)
      DailyStats.findAll({
        attributes: [
          [literal("DATE_FORMAT(date, '%Y-%m')"), "month"],
          [fn("SUM", col("totalVisitors")), "sessions"],
          [fn("SUM", col("totalPageViews")), "pageViews"],
          [fn("SUM", col("newUsers")), "newUsers"],
          [fn("AVG", col("bounceRate")), "avgBounceRate"],
        ],
        where: dailyStatsDateFilter,
        group: [literal("DATE_FORMAT(date, '%Y-%m')")],
        order: [[literal("DATE_FORMAT(date, '%Y-%m')"), "ASC"]],
      }).catch((error: unknown) => {
        console.warn("Monthly trends calculation failed:", error);
        return [] as MonthlyTrendResult[];
      }) as Promise<MonthlyTrendResult[]>,

      // Realtime statistics
      getRealtimeStats(AnalyticsSession, PageView, new Date()),
    ]);

    console.log(`⚡ Queries completed in ${Date.now() - startTime}ms`);

    // Process breakdown data efficiently
    const { deviceBreakdown, userTypeBreakdown, botSessions, humanSessions } =
      processBreakdownData(breakdownStats);

    // Process other data
    const mergedHourlyActivity = mergeHourlyData(
      hourlySessionActivity,
      hourlyPageViewActivity
    );
    const mergedWeeklyPatterns = mergeWeeklyData(
      weeklySessionPatterns,
      weeklyPageViewPatterns
    );

    // Calculate growth rates
    const calculateGrowth = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    // Extract realtime data
    const [
      activeNow,
      todaySessionsResult,
      todayPageViewsResult,
      last24hSessionsResult,
      previous24hSessionsResult,
      last24hPageViewsResult,
      previous24hPageViewsResult,
    ] = realtimeResults;

    const todaySessions = parseInt(
      extractValue(todaySessionsResult, "todaySessions")
    );
    const todayPageViews = parseInt(
      extractValue(todayPageViewsResult, "todayPageViews")
    );
    const last24hSessions = parseInt(
      extractValue(last24hSessionsResult, "last24hSessions")
    );
    const previous24hSessions = parseInt(
      extractValue(previous24hSessionsResult, "previous24hSessions")
    );
    const last24hPageViews = parseInt(
      extractValue(last24hPageViewsResult, "last24hPageViews")
    );
    const previous24hPageViews = parseInt(
      extractValue(previous24hPageViewsResult, "previous24hPageViews")
    );

    // Build comprehensive response
    const statistics: OverallStatistics = {
      totalSessions: parseInt(extractValue(sessionStats, "totalSessions")),
      totalPageViews: parseInt(extractValue(pageViewStats, "totalPageViews")),
      totalUniqueVisitors: parseInt(
        extractValue(sessionStats, "totalUniqueVisitors")
      ),
      totalUniqueUsers: parseInt(
        extractValue(sessionStats, "totalUniqueUsers")
      ),
      avgSessionDuration: parseFloat(
        extractValue(sessionStats, "avgSessionDuration")
      ),
      avgTimeOnPage: parseFloat(extractValue(pageViewStats, "avgTimeOnPage")),
      bounceRate: 0, // Will be calculated from daily stats if needed
      activeSessions: activeNow,
      newUsers: 0, // From daily stats
      returningUsers: 0, // From daily stats
      mobileUsers: deviceBreakdown.mobile,
      desktopUsers: deviceBreakdown.desktop,
      botSessions,
      humanSessions,
      topCountries: topCountries.reduce(
        (acc: Record<string, number>, item: GeographicStatsResult) => {
          const country = extractValue(item, "country") || "Unknown";
          const count = parseInt(extractValue(item, "count"));
          if (country !== "Unknown" && country !== "0") {
            acc[country] = count;
          }
          return acc;
        },
        {}
      ),
      topPages: topPages.map((page: ContentStatsResult) => ({
        page: extractValue(page, "page"),
        views: parseInt(extractValue(page, "views")),
        avgTime: parseFloat(extractValue(page, "avgTime")),
        uniqueVisitors: parseInt(extractValue(page, "uniqueVisitors")),
      })),
      deviceBreakdown,
      userTypeBreakdown,
      exitPageStats: exitPageStats.reduce(
        (
          acc: { exitPages: number; nonExitPages: number },
          item: ContentStatsResult
        ) => {
          const isExit =
            item.dataValues?.exitPage !== undefined
              ? item.dataValues.exitPage
              : item.exitPage;
          const count = parseInt(extractValue(item, "count"));
          if (isExit) {
            acc.exitPages = count;
          } else {
            acc.nonExitPages = count;
          }
          return acc;
        },
        { exitPages: 0, nonExitPages: 0 }
      ),
      hourlyActivity: mergedHourlyActivity,
      dailyTrends: dailyTrends.map((day: DailyTrendResult) => ({
        date: extractValue(day, "date"),
        sessions: parseInt(extractValue(day, "totalVisitors")),
        pageViews: parseInt(extractValue(day, "totalPageViews")),
        uniqueVisitors: parseInt(extractValue(day, "uniqueVisitors")),
        newUsers: parseInt(extractValue(day, "newUsers")),
        bounceRate: parseFloat(extractValue(day, "bounceRate")),
      })),
      monthlyTrends: (monthlyTrends || []).map((month: MonthlyTrendResult) => ({
        month: extractValue(month, "month"),
        sessions: parseInt(extractValue(month, "sessions")),
        pageViews: parseInt(extractValue(month, "pageViews")),
        newUsers: parseInt(extractValue(month, "newUsers")),
        avgSessionDuration: parseFloat(extractValue(month, "avgBounceRate")),
      })),
      realtimeStats: {
        activeNow,
        todaySessions,
        todayPageViews,
        todayNewUsers: 0, // Calculate from daily stats if needed
        last24hGrowth: {
          sessions: calculateGrowth(last24hSessions, previous24hSessions),
          pageViews: calculateGrowth(last24hPageViews, previous24hPageViews),
          users: 0, // Calculate if needed
        },
      },
    };

    console.log(
      `✅ Optimized statistics completed in ${Date.now() - startTime}ms`
    );

    return NextResponse.json({
      success: true,
      message: "Statistik komprehensif berhasil diambil (optimized)",
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

        // Extended stats
        browserStats: browserOsStats.reduce(
          (acc: Record<string, number>, item: ContentStatsResult) => {
            const browser = extractValue(item, "browser");
            if (browser && browser !== "0") {
              acc[browser] =
                (acc[browser] || 0) + parseInt(extractValue(item, "count"));
            }
            return acc;
          },
          {}
        ),
        osStats: browserOsStats.reduce(
          (acc: Record<string, number>, item: ContentStatsResult) => {
            const os = extractValue(item, "os");
            if (os && os !== "0") {
              acc[os] = (acc[os] || 0) + parseInt(extractValue(item, "count"));
            }
            return acc;
          },
          {}
        ),
        geographicStats: {
          totalCountries: parseInt(
            extractValue(geographicTotals, "totalCountries")
          ),
          totalCities: parseInt(extractValue(geographicTotals, "totalCities")),
          topCities: topCities.reduce(
            (acc: Record<string, number>, item: GeographicStatsResult) => {
              const city = extractValue(item, "city") || "Unknown";
              const count = parseInt(extractValue(item, "count"));
              if (city !== "Unknown" && city !== "0") {
                acc[city] = count;
              }
              return acc;
            },
            {}
          ),
        },
        temporalPatterns: {
          weeklyPatterns: mergedWeeklyPatterns,
          seasonalTrends: {
            currentPeriod: {
              sessions: statistics.totalSessions,
              pageViews: statistics.totalPageViews,
              uniqueVisitors: statistics.totalUniqueVisitors,
            },
          },
        },
        performance: {
          queryTime: `${Date.now() - startTime}ms`,
          optimized: true,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("💥 Error fetching optimized statistics:", error);
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
