import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";

export const dynamic = "force-dynamic";

// Define proper interfaces for Sequelize models
interface AnalyticsSessionModel {
  id: number;
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
  isBot: boolean;
  startTime: Date;
  endTime?: Date;
  duration?: number;
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

// Define interfaces for aggregation query results
interface DeviceTypeCount {
  deviceType: string;
  count: string;
}

interface CountryCount {
  country: string | null;
  count: string;
}

interface BotCount {
  isBot: boolean;
  count: string;
}

interface UserTypeCount {
  userType: string;
  count: string;
}

interface AvgDurationResult {
  avgDuration: string | null;
}

// Define utility type for count reduction
type CountRecord = Record<string, number>;

// GET - Read all analytics sessions with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    console.log("📊 Getting analytics sessions data");

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

    // Import AnalyticsSession model
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const AnalyticsSession =
      require("../../../../../models/analyticssession.js")(
        sequelize,
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require("sequelize").DataTypes
      );

    // Import User model for associations
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const User = require("../../../../../models/user.js")(
      sequelize,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("sequelize").DataTypes
    );

    // Import PageView model for counts - Fixed: Handle error properly
    let PageView;
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      PageView = require("../../../../../models/pageview.js")(
        sequelize,
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require("sequelize").DataTypes
      );
    } catch (pageViewError) {
      console.warn(
        "PageView model not found, continuing without page view counts:",
        pageViewError instanceof Error
          ? pageViewError.message
          : String(pageViewError)
      );
    }

    // Set up associations
    AnalyticsSession.belongsTo(User, {
      foreignKey: "userId",
      as: "user",
    });

    if (PageView) {
      AnalyticsSession.hasMany(PageView, {
        foreignKey: "sessionId",
        sourceKey: "sessionId",
        as: "pageViews",
      });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Filters
    const search = searchParams.get("search") || undefined;
    const deviceType = searchParams.get("deviceType") || undefined;
    const isBot = searchParams.get("isBot");
    const country = searchParams.get("country") || undefined;
    const userType = searchParams.get("userType"); // "authenticated", "anonymous", "all"
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    // Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder =
      (searchParams.get("sortOrder") as "ASC" | "DESC") || "DESC";

    console.log("🔍 Query parameters:", {
      page,
      limit,
      search,
      deviceType,
      isBot,
      country,
      userType,
      dateFrom,
      dateTo,
      sortBy,
      sortOrder,
    });

    // Validate sort field
    const allowedSortFields = [
      "createdAt",
      "updatedAt",
      "startTime",
      "endTime",
      "duration",
      "sessionId",
      "deviceType",
      "country",
      "isBot",
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

    // Build where clause
    const whereClause: Record<string, unknown> = {};

    if (search) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (whereClause as any)[Op.or] = [
        { sessionId: { [Op.iLike]: `%${search}%` } },
        { ipAddress: { [Op.iLike]: `%${search}%` } },
        { browser: { [Op.iLike]: `%${search}%` } },
        { os: { [Op.iLike]: `%${search}%` } },
        { country: { [Op.iLike]: `%${search}%` } },
        { city: { [Op.iLike]: `%${search}%` } },
        { landingPage: { [Op.iLike]: `%${search}%` } },
        { referrer: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Device type filter
    if (deviceType) {
      whereClause.deviceType = deviceType;
    }

    // Bot filter
    if (isBot !== null && isBot !== undefined) {
      whereClause.isBot = isBot === "true";
    }

    // Country filter
    if (country) {
      whereClause.country = { [Op.iLike]: `%${country}%` };
    }

    // User type filter
    if (userType === "authenticated") {
      whereClause.userId = { [Op.not]: null };
    } else if (userType === "anonymous") {
      whereClause.userId = { [Op.is]: null };
    }

    // Date range filter
    if (dateFrom || dateTo) {
      whereClause.startTime = {};
      if (dateFrom) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (whereClause.startTime as any)[Op.gte] = new Date(dateFrom);
      }
      if (dateTo) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (whereClause.startTime as any)[Op.lte] = new Date(dateTo);
      }
    }

    // Get total count for pagination (without pagination)
    const totalCount = await AnalyticsSession.count({
      where: whereClause,
    });

    console.log("📊 Total analytics sessions found:", totalCount);

    // Return 404 if no data found
    if (totalCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Tidak ada data analytics sessions yang ditemukan",
        },
        { status: 404 }
      );
    }

    // Get analytics sessions with associations
    const sessions = await AnalyticsSession.findAll({
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

    // Get filter options for frontend
    const deviceTypeOptions = ["desktop", "mobile", "tablet", "unknown"];

    // Get device type counts for statistics
    const deviceTypeCounts = (await AnalyticsSession.findAll({
      attributes: [
        "deviceType",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["deviceType"],
      raw: true,
    })) as DeviceTypeCount[];

    // Get country counts for statistics
    const countryCounts = (await AnalyticsSession.findAll({
      attributes: [
        "country",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: {
        country: { [Op.not]: null },
      },
      group: ["country"],
      order: [[sequelize.fn("COUNT", sequelize.col("id")), "DESC"]],
      limit: 10,
      raw: true,
    })) as CountryCount[];

    // Get bot vs human counts
    const botCounts = (await AnalyticsSession.findAll({
      attributes: [
        "isBot",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["isBot"],
      raw: true,
    })) as BotCount[];

    // Get user type counts
    const userTypeCounts = (await AnalyticsSession.findAll({
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
      group: [
        sequelize.literal(`
        CASE 
          WHEN "userId" IS NOT NULL THEN 'authenticated'
          ELSE 'anonymous'
        END
      `),
      ],
      raw: true,
    })) as UserTypeCount[];

    // Calculate some statistics
    const totalPageViews = PageView ? await PageView.count() : 0;
    const uniqueVisitors = await AnalyticsSession.count({
      distinct: true,
      col: "ipAddress",
    });

    // Calculate average session duration
    const avgDurationResult = (await AnalyticsSession.findOne({
      attributes: [
        [sequelize.fn("AVG", sequelize.col("duration")), "avgDuration"],
      ],
      where: {
        duration: { [Op.not]: null },
      },
      raw: true,
    })) as AvgDurationResult | null;

    const avgSessionDuration = parseFloat(
      avgDurationResult?.avgDuration || "0"
    );

    // Calculate active sessions (last 30 minutes)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const activeSessions = await AnalyticsSession.count({
      where: {
        [Op.or]: [
          { endTime: null },
          { endTime: { [Op.gte]: thirtyMinutesAgo } },
        ],
        startTime: { [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // within last 24 hours
      },
    });

    // Helper functions for type-safe reductions
    const reduceDeviceTypeCounts = (counts: DeviceTypeCount[]): CountRecord => {
      return counts.reduce((acc: CountRecord, item: DeviceTypeCount) => {
        acc[item.deviceType] = parseInt(item.count || "0");
        return acc;
      }, {});
    };

    const reduceCountryCounts = (counts: CountryCount[]): CountRecord => {
      return counts.reduce((acc: CountRecord, item: CountryCount) => {
        const country = item.country || "Unknown";
        acc[country] = parseInt(item.count || "0");
        return acc;
      }, {});
    };

    const reduceBotCounts = (counts: BotCount[]): CountRecord => {
      return counts.reduce((acc: CountRecord, item: BotCount) => {
        const key = item.isBot ? "bots" : "humans";
        acc[key] = parseInt(item.count || "0");
        return acc;
      }, {});
    };

    const reduceUserTypeCounts = (counts: UserTypeCount[]): CountRecord => {
      return counts.reduce((acc: CountRecord, item: UserTypeCount) => {
        const userType = item.userType || "unknown";
        acc[userType] = parseInt(item.count || "0");
        return acc;
      }, {});
    };

    console.log("✅ Analytics sessions data retrieved successfully");

    return NextResponse.json({
      success: true,
      message: "Data analytics sessions berhasil diambil",
      data: {
        sessions: sessions.map((session: AnalyticsSessionModel) => ({
          id: session.id,
          sessionId: session.sessionId,
          userId: session.userId,
          ipAddress: session.ipAddress,
          userAgent: session.userAgent,
          deviceType: session.deviceType,
          browser: session.browser,
          os: session.os,
          country: session.country,
          city: session.city,
          referrer: session.referrer,
          landingPage: session.landingPage,
          isBot: session.isBot,
          startTime: session.startTime,
          endTime: session.endTime,
          duration: session.duration,
          user: session.user,
          createdAt: session.createdAt,
          updatedAt: session.updatedAt,
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
        filters: {
          deviceTypeOptions,
          deviceTypeCounts: reduceDeviceTypeCounts(deviceTypeCounts),
          countryCounts: reduceCountryCounts(countryCounts),
          botCounts: reduceBotCounts(botCounts),
          userTypeCounts: reduceUserTypeCounts(userTypeCounts),
        },
        appliedFilters: {
          search,
          deviceType,
          isBot: isBot ? isBot === "true" : undefined,
          country,
          userType,
          dateFrom,
          dateTo,
        },
        appliedSort: {
          field: sortBy,
          order: sortOrder,
        },
        overallStats: {
          totalSessions: totalCount,
          totalPageViews,
          uniqueVisitors,
          avgSessionDuration,
          activeSessions,
          deviceTypeCounts: reduceDeviceTypeCounts(deviceTypeCounts),
          countryCounts: reduceCountryCounts(countryCounts),
          botCounts: reduceBotCounts(botCounts),
          userTypeCounts: reduceUserTypeCounts(userTypeCounts),
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("💥 Error fetching analytics sessions:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat mengambil data analytics sessions",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
