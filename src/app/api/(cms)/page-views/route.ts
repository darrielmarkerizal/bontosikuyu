import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";

export const dynamic = "force-dynamic";

// Define proper interfaces for Sequelize models
interface PageViewModel {
  id: number;
  sessionId: string;
  userId?: number;
  page: string;
  title?: string;
  timeOnPage?: number;
  exitPage: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: UserModel;
  getDataValue(key: string): unknown;
}

interface UserModel {
  id: number;
  fullName: string;
  email: string;
  username: string;
}

// Define interfaces for aggregation results
interface SummaryStatsResult {
  totalPageViews: string;
  uniqueSessions: string;
  uniqueUsers: string;
  avgTimeOnPage: string;
  maxTimeOnPage: string;
  minTimeOnPage: string;
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

interface UserTypeStatsResult {
  userType: string;
  count: string;
}

interface HourlyActivityResult {
  hour: string;
  views: string;
}

interface DailyActivityResult {
  date: string;
  views: string;
  sessions: string;
}

// Define interfaces for where clause conditions
interface DateCondition {
  [Op.gte]?: Date;
  [Op.lte]?: Date;
}

interface NumberCondition {
  [Op.gte]?: number;
  [Op.lte]?: number;
}

// Helper function to load models and database
async function loadModels() {
  /* eslint-disable @typescript-eslint/no-require-imports */
  const sequelize = require("../../../../../config/database");
  const { DataTypes } = require("sequelize");

  const PageView = require("../../../../../models/pageview.js")(
    sequelize,
    DataTypes
  );
  const User = require("../../../../../models/user.js")(sequelize, DataTypes);
  /* eslint-enable @typescript-eslint/no-require-imports */

  return { sequelize, PageView, User };
}

// GET - Read all page views with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    console.log("📊 Getting page views data");

    // Load models and database connection
    const { sequelize, PageView, User } = await loadModels();

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

    // Set up associations
    PageView.belongsTo(User, {
      foreignKey: "userId",
      as: "user",
    });

    // Parse query parameters
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Filters
    const search = searchParams.get("search") || undefined;
    const sessionId = searchParams.get("sessionId") || undefined;
    const userId = searchParams.get("userId") || undefined;
    const userType = searchParams.get("userType"); // "authenticated", "anonymous", "all"
    const exitPage = searchParams.get("exitPage"); // "true", "false", "all"
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const minTimeOnPage = searchParams.get("minTimeOnPage");
    const maxTimeOnPage = searchParams.get("maxTimeOnPage");
    const pageUrl = searchParams.get("pageUrl");

    // Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder =
      (searchParams.get("sortOrder") as "ASC" | "DESC") || "DESC";

    console.log("🔍 Query parameters:", {
      page,
      limit,
      search,
      sessionId,
      userId,
      userType,
      exitPage,
      dateFrom,
      dateTo,
      minTimeOnPage,
      maxTimeOnPage,
      pageUrl,
      sortBy,
      sortOrder,
    });

    // Validate sort field
    const allowedSortFields = [
      "createdAt",
      "updatedAt",
      "sessionId",
      "userId",
      "page",
      "title",
      "timeOnPage",
      "exitPage",
    ];

    if (!allowedSortFields.includes(sortBy)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid sort field. Allowed fields: ${allowedSortFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Build where conditions with proper typing
    const baseConditions: Array<Record<string, unknown>> = [];

    // Search functionality
    if (search) {
      baseConditions.push({
        [Op.or]: [
          { sessionId: { [Op.iLike]: `%${search}%` } },
          { page: { [Op.iLike]: `%${search}%` } },
          { title: { [Op.iLike]: `%${search}%` } },
        ],
      });
    }

    // Session ID filter
    if (sessionId) {
      baseConditions.push({ sessionId: { [Op.iLike]: `%${sessionId}%` } });
    }

    // User ID filter
    if (userId) {
      baseConditions.push({ userId: parseInt(userId) });
    }

    // User type filter
    if (userType === "authenticated") {
      baseConditions.push({ userId: { [Op.not]: null } });
    } else if (userType === "anonymous") {
      baseConditions.push({ userId: { [Op.is]: null } });
    }

    // Exit page filter
    if (exitPage !== null && exitPage !== undefined && exitPage !== "all") {
      baseConditions.push({ exitPage: exitPage === "true" });
    }

    // Date range filter
    if (dateFrom || dateTo) {
      const dateCondition: DateCondition = {};
      if (dateFrom) {
        dateCondition[Op.gte] = new Date(dateFrom);
      }
      if (dateTo) {
        dateCondition[Op.lte] = new Date(dateTo);
      }
      baseConditions.push({ createdAt: dateCondition });
    }

    // Time on page range filter
    if (minTimeOnPage || maxTimeOnPage) {
      const timeCondition: NumberCondition = {};
      if (minTimeOnPage) {
        timeCondition[Op.gte] = parseInt(minTimeOnPage);
      }
      if (maxTimeOnPage) {
        timeCondition[Op.lte] = parseInt(maxTimeOnPage);
      }
      baseConditions.push({ timeOnPage: timeCondition });
    }

    // Page URL filter
    if (pageUrl) {
      baseConditions.push({ page: { [Op.iLike]: `%${pageUrl}%` } });
    }

    // Combine all conditions
    const whereClause =
      baseConditions.length > 0 ? { [Op.and]: baseConditions } : {};

    // Get total count for pagination
    const totalCount = await PageView.count({
      where: whereClause,
    });

    console.log("📊 Total page views found:", totalCount);

    // Return 404 if no data found
    if (totalCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Tidak ada data page views yang ditemukan",
        },
        { status: 404 }
      );
    }

    // Get page views with associations
    const pageViews = await PageView.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "email", "username"],
          required: false,
        },
      ],
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });

    // Calculate pagination
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Get summary statistics
    const summaryStats = (await PageView.findOne({
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "totalPageViews"],
        [
          sequelize.fn("COUNT", sequelize.literal("DISTINCT sessionId")),
          "uniqueSessions",
        ],
        [
          sequelize.fn("COUNT", sequelize.literal("DISTINCT userId")),
          "uniqueUsers",
        ],
        [sequelize.fn("AVG", sequelize.col("timeOnPage")), "avgTimeOnPage"],
        [sequelize.fn("MAX", sequelize.col("timeOnPage")), "maxTimeOnPage"],
        [sequelize.fn("MIN", sequelize.col("timeOnPage")), "minTimeOnPage"],
      ],
      where: whereClause,
      raw: true,
    })) as SummaryStatsResult | null;

    // Get top pages statistics
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
      where: whereClause,
      group: ["page"],
      order: [[sequelize.fn("COUNT", sequelize.col("id")), "DESC"]],
      limit: 10,
      raw: true,
    })) as TopPageResult[];

    // Get exit page statistics
    const exitPageStats = (await PageView.findAll({
      attributes: [
        "exitPage",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: whereClause,
      group: ["exitPage"],
      raw: true,
    })) as ExitPageStatsResult[];

    // Get user type statistics
    const userTypeStats = (await PageView.findAll({
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
      where: whereClause,
      group: [
        sequelize.literal(`
          CASE 
            WHEN "userId" IS NOT NULL THEN 'authenticated'
            ELSE 'anonymous'
          END
        `),
      ],
      raw: true,
    })) as UserTypeStatsResult[];

    // Get hourly activity (for today or date range)
    const hourlyActivity = (await PageView.findAll({
      attributes: [
        [sequelize.fn("HOUR", sequelize.col("createdAt")), "hour"],
        [sequelize.fn("COUNT", sequelize.col("id")), "views"],
      ],
      where: whereClause,
      group: [sequelize.fn("HOUR", sequelize.col("createdAt"))],
      order: [[sequelize.fn("HOUR", sequelize.col("createdAt")), "ASC"]],
      raw: true,
    })) as HourlyActivityResult[];

    // Get daily activity for trend analysis
    let dailyActivity: DailyActivityResult[] = [];
    try {
      dailyActivity = (await PageView.findAll({
        attributes: [
          [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
          [sequelize.fn("COUNT", sequelize.col("id")), "views"],
          [
            sequelize.fn("COUNT", sequelize.literal("DISTINCT sessionId")),
            "sessions",
          ],
        ],
        where: whereClause,
        group: [sequelize.fn("DATE", sequelize.col("createdAt"))],
        order: [[sequelize.fn("DATE", sequelize.col("createdAt")), "ASC"]],
        limit: 30, // Last 30 days
        raw: true,
      })) as DailyActivityResult[];
    } catch (error) {
      console.warn("Daily activity calculation failed:", error);
      dailyActivity = [];
    }

    console.log("✅ Page views data retrieved successfully");

    return NextResponse.json({
      success: true,
      message: "Data page views berhasil diambil",
      data: {
        pageViews: pageViews.map((view: PageViewModel) => ({
          id: view.id,
          sessionId: view.sessionId,
          userId: view.userId,
          page: view.page,
          title: view.title,
          timeOnPage: view.timeOnPage,
          exitPage: view.exitPage,
          user: view.user,
          createdAt: view.createdAt,
          updatedAt: view.updatedAt,
        })),
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalCount,
          itemsPerPage: limit,
          hasNextPage,
          hasPrevPage,
          nextPage: hasNextPage ? page + 1 : null,
          prevPage: hasPrevPage ? page - 1 : null,
        },
        summaryStats: {
          totalPageViews: parseInt(summaryStats?.totalPageViews || "0"),
          uniqueSessions: parseInt(summaryStats?.uniqueSessions || "0"),
          uniqueUsers: parseInt(summaryStats?.uniqueUsers || "0"),
          avgTimeOnPage: parseFloat(summaryStats?.avgTimeOnPage || "0"),
          maxTimeOnPage: parseInt(summaryStats?.maxTimeOnPage || "0"),
          minTimeOnPage: parseInt(summaryStats?.minTimeOnPage || "0"),
        },
        analytics: {
          topPages: topPages.map((page: TopPageResult) => ({
            page: page.page,
            views: parseInt(page.views || "0"),
            avgTime: parseFloat(page.avgTime || "0"),
            uniqueVisitors: parseInt(page.uniqueVisitors || "0"),
          })),
          exitPageStats: exitPageStats.reduce(
            (acc: Record<string, number>, item: ExitPageStatsResult) => {
              const key = item.exitPage ? "exitPages" : "nonExitPages";
              acc[key] = parseInt(item.count || "0");
              return acc;
            },
            { exitPages: 0, nonExitPages: 0 }
          ),
          userTypeStats: userTypeStats.reduce(
            (acc: Record<string, number>, item: UserTypeStatsResult) => {
              const userType = item.userType || "unknown";
              acc[userType] = parseInt(item.count || "0");
              return acc;
            },
            {}
          ),
          hourlyActivity: hourlyActivity.map((hour: HourlyActivityResult) => ({
            hour: parseInt(hour.hour || "0"),
            views: parseInt(hour.views || "0"),
          })),
          dailyActivity: dailyActivity.map((day: DailyActivityResult) => ({
            date: day.date,
            views: parseInt(day.views || "0"),
            sessions: parseInt(day.sessions || "0"),
          })),
        },
        filters: {
          userTypeOptions: ["authenticated", "anonymous", "all"],
          exitPageOptions: ["true", "false", "all"],
          topPagesForFilter: topPages
            .slice(0, 5)
            .map((page: TopPageResult) => page.page),
        },
        appliedFilters: {
          search,
          sessionId,
          userId: userId ? parseInt(userId) : undefined,
          userType,
          exitPage,
          dateFrom,
          dateTo,
          minTimeOnPage: minTimeOnPage ? parseInt(minTimeOnPage) : undefined,
          maxTimeOnPage: maxTimeOnPage ? parseInt(maxTimeOnPage) : undefined,
          pageUrl,
        },
        appliedSort: {
          field: sortBy,
          order: sortOrder,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("💥 Error fetching page views:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat mengambil data page views",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
