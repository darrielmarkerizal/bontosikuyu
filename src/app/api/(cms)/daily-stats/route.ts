import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";

// Define proper interfaces for Sequelize models
interface DailyStatsModel {
  id: number;
  date: string;
  totalVisitors: number;
  uniqueVisitors: number;
  totalPageViews: number;
  newUsers: number;
  returningUsers: number;
  mobileUsers: number;
  desktopUsers: number;
  bounceRate: number;
  createdAt: Date;
  updatedAt: Date;
  getDataValue(key: string): unknown;
}

// GET - Read all daily stats with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    console.log("📊 Getting daily stats data");

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

    // Import DailyStats model
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const DailyStats = require("../../../../../models/dailystats.js")(
      sequelize,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("sequelize").DataTypes
    );

    // Parse query parameters
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "30"); // Default 30 days
    const offset = (page - 1) * limit;

    // Filters
    const search = searchParams.get("search") || undefined;
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const minVisitors = searchParams.get("minVisitors");
    const maxVisitors = searchParams.get("maxVisitors");
    const minPageViews = searchParams.get("minPageViews");
    const maxPageViews = searchParams.get("maxPageViews");
    const deviceFilter = searchParams.get("deviceFilter"); // "mobile", "desktop", "both"

    // Sorting
    const sortBy = searchParams.get("sortBy") || "date";
    const sortOrder =
      (searchParams.get("sortOrder") as "ASC" | "DESC") || "DESC";

    console.log("🔍 Query parameters:", {
      page,
      limit,
      search,
      dateFrom,
      dateTo,
      minVisitors,
      maxVisitors,
      minPageViews,
      maxPageViews,
      deviceFilter,
      sortBy,
      sortOrder,
    });

    // Validate sort field
    const allowedSortFields = [
      "date",
      "totalVisitors",
      "uniqueVisitors",
      "totalPageViews",
      "newUsers",
      "returningUsers",
      "mobileUsers",
      "desktopUsers",
      "bounceRate",
      "createdAt",
      "updatedAt",
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

    // Device filter - fix using array approach
    const baseConditions: any[] = [];

    // Add search condition
    if (search) {
      baseConditions.push({ date: { [Op.iLike]: `%${search}%` } });
    }

    // Add date range condition
    if (dateFrom || dateTo) {
      const dateCondition: any = {};
      if (dateFrom) {
        dateCondition[Op.gte] = dateFrom;
      }
      if (dateTo) {
        dateCondition[Op.lte] = dateTo;
      }
      baseConditions.push({ date: dateCondition });
    }

    // Add visitors range condition
    if (minVisitors || maxVisitors) {
      const visitorsCondition: any = {};
      if (minVisitors) {
        visitorsCondition[Op.gte] = parseInt(minVisitors);
      }
      if (maxVisitors) {
        visitorsCondition[Op.lte] = parseInt(maxVisitors);
      }
      baseConditions.push({ totalVisitors: visitorsCondition });
    }

    // Add page views range condition
    if (minPageViews || maxPageViews) {
      const pageViewsCondition: any = {};
      if (minPageViews) {
        pageViewsCondition[Op.gte] = parseInt(minPageViews);
      }
      if (maxPageViews) {
        pageViewsCondition[Op.lte] = parseInt(maxPageViews);
      }
      baseConditions.push({ totalPageViews: pageViewsCondition });
    }

    // Add device filter condition
    if (deviceFilter === "mobile") {
      baseConditions.push(sequelize.literal("`mobileUsers` > `desktopUsers`"));
    } else if (deviceFilter === "desktop") {
      baseConditions.push(sequelize.literal("`desktopUsers` > `mobileUsers`"));
    }

    // Combine all conditions
    const whereClause =
      baseConditions.length > 0 ? { [Op.and]: baseConditions } : {};

    // Get total count for pagination (without pagination)
    const totalCount = await DailyStats.count({
      where: whereClause,
    });

    console.log("📊 Total daily stats found:", totalCount);

    // Return 404 if no data found
    if (totalCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Tidak ada data daily stats yang ditemukan",
        },
        { status: 404 }
      );
    }

    // Get daily stats
    const dailyStats = await DailyStats.findAll({
      where: whereClause,
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });

    // Calculate pagination
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Calculate summary statistics
    const summaryStats = await DailyStats.findOne({
      attributes: [
        [
          sequelize.fn("SUM", sequelize.col("totalVisitors")),
          "totalVisitorsSum",
        ],
        [
          sequelize.fn("SUM", sequelize.col("uniqueVisitors")),
          "uniqueVisitorsSum",
        ],
        [
          sequelize.fn("SUM", sequelize.col("totalPageViews")),
          "totalPageViewsSum",
        ],
        [sequelize.fn("SUM", sequelize.col("newUsers")), "newUsersSum"],
        [
          sequelize.fn("SUM", sequelize.col("returningUsers")),
          "returningUsersSum",
        ],
        [sequelize.fn("SUM", sequelize.col("mobileUsers")), "mobileUsersSum"],
        [sequelize.fn("SUM", sequelize.col("desktopUsers")), "desktopUsersSum"],
        [sequelize.fn("AVG", sequelize.col("bounceRate")), "avgBounceRate"],
        [sequelize.fn("MAX", sequelize.col("totalVisitors")), "maxVisitors"],
        [sequelize.fn("MIN", sequelize.col("totalVisitors")), "minVisitors"],
        [sequelize.fn("MAX", sequelize.col("totalPageViews")), "maxPageViews"],
        [sequelize.fn("MIN", sequelize.col("totalPageViews")), "minPageViews"],
      ],
      where: whereClause,
      raw: true,
    });

    // Get date range for the filtered data
    const dateRange = await DailyStats.findOne({
      attributes: [
        [sequelize.fn("MIN", sequelize.col("date")), "earliestDate"],
        [sequelize.fn("MAX", sequelize.col("date")), "latestDate"],
      ],
      where: whereClause,
      raw: true,
    });

    // Get monthly aggregation for trends - Fixed MySQL GROUP BY issue
    const monthlyTrends = await DailyStats.findAll({
      attributes: [
        // Use proper aggregation for MySQL ONLY_FULL_GROUP_BY mode
        [
          sequelize.literal(
            "CONCAT(YEAR(`date`), '-', LPAD(MONTH(`date`), 2, '0'))"
          ),
          "month",
        ],
        [
          sequelize.fn("SUM", sequelize.col("totalVisitors")),
          "monthlyVisitors",
        ],
        [
          sequelize.fn("SUM", sequelize.col("totalPageViews")),
          "monthlyPageViews",
        ],
        [sequelize.fn("SUM", sequelize.col("newUsers")), "monthlyNewUsers"],
        [sequelize.fn("AVG", sequelize.col("bounceRate")), "monthlyBounceRate"],
      ],
      where: whereClause,
      group: [
        // Group by the same expression used in SELECT
        sequelize.literal(
          "CONCAT(YEAR(`date`), '-', LPAD(MONTH(`date`), 2, '0'))"
        ),
      ],
      order: [
        // Order by the same expression
        [
          sequelize.literal(
            "CONCAT(YEAR(`date`), '-', LPAD(MONTH(`date`), 2, '0'))"
          ),
          "ASC",
        ],
      ],
      raw: true,
    });

    // Get device breakdown
    const deviceBreakdown = await DailyStats.findOne({
      attributes: [
        [sequelize.fn("SUM", sequelize.col("mobileUsers")), "totalMobileUsers"],
        [
          sequelize.fn("SUM", sequelize.col("desktopUsers")),
          "totalDesktopUsers",
        ],
      ],
      where: whereClause,
      raw: true,
    });

    // Get user type breakdown
    const userTypeBreakdown = await DailyStats.findOne({
      attributes: [
        [sequelize.fn("SUM", sequelize.col("newUsers")), "totalNewUsers"],
        [
          sequelize.fn("SUM", sequelize.col("returningUsers")),
          "totalReturningUsers",
        ],
      ],
      where: whereClause,
      raw: true,
    });

    // Calculate growth trends (compare with previous period)
    const periodDays = Math.max(
      1,
      Math.ceil(totalCount / Math.max(1, totalPages))
    );
    const previousPeriodStart = new Date();
    const previousPeriodEnd = new Date();

    if (dateFrom) {
      previousPeriodStart.setTime(
        new Date(dateFrom).getTime() - periodDays * 24 * 60 * 60 * 1000
      );
      previousPeriodEnd.setTime(new Date(dateFrom).getTime() - 1);
    } else {
      previousPeriodStart.setTime(
        Date.now() - 2 * periodDays * 24 * 60 * 60 * 1000
      );
      previousPeriodEnd.setTime(Date.now() - periodDays * 24 * 60 * 60 * 1000);
    }

    const previousPeriodStats = await DailyStats.findOne({
      attributes: [
        [
          sequelize.fn("SUM", sequelize.col("totalVisitors")),
          "prevTotalVisitors",
        ],
        [
          sequelize.fn("SUM", sequelize.col("totalPageViews")),
          "prevTotalPageViews",
        ],
        [sequelize.fn("AVG", sequelize.col("bounceRate")), "prevAvgBounceRate"],
      ],
      where: {
        date: {
          [Op.gte]: previousPeriodStart.toISOString().split("T")[0],
          [Op.lte]: previousPeriodEnd.toISOString().split("T")[0],
        },
      },
      raw: true,
    });

    // Calculate growth rates
    const currentTotalVisitors = parseInt(
      summaryStats?.totalVisitorsSum || "0"
    );
    const previousTotalVisitors = parseInt(
      previousPeriodStats?.prevTotalVisitors || "0"
    );
    const visitorsGrowthRate =
      previousTotalVisitors > 0
        ? ((currentTotalVisitors - previousTotalVisitors) /
            previousTotalVisitors) *
          100
        : 0;

    const currentTotalPageViews = parseInt(
      summaryStats?.totalPageViewsSum || "0"
    );
    const previousTotalPageViews = parseInt(
      previousPeriodStats?.prevTotalPageViews || "0"
    );
    const pageViewsGrowthRate =
      previousTotalPageViews > 0
        ? ((currentTotalPageViews - previousTotalPageViews) /
            previousTotalPageViews) *
          100
        : 0;

    console.log("✅ Daily stats data retrieved successfully");

    return NextResponse.json({
      success: true,
      message: "Data daily stats berhasil diambil",
      data: {
        dailyStats: dailyStats.map((stat: DailyStatsModel) => ({
          id: stat.id,
          date: stat.date,
          totalVisitors: stat.totalVisitors,
          uniqueVisitors: stat.uniqueVisitors,
          totalPageViews: stat.totalPageViews,
          newUsers: stat.newUsers,
          returningUsers: stat.returningUsers,
          mobileUsers: stat.mobileUsers,
          desktopUsers: stat.desktopUsers,
          bounceRate: parseFloat(stat.bounceRate?.toString() || "0"),
          createdAt: stat.createdAt,
          updatedAt: stat.updatedAt,
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
          totalVisitorsSum: parseInt(summaryStats?.totalVisitorsSum || "0"),
          uniqueVisitorsSum: parseInt(summaryStats?.uniqueVisitorsSum || "0"),
          totalPageViewsSum: parseInt(summaryStats?.totalPageViewsSum || "0"),
          newUsersSum: parseInt(summaryStats?.newUsersSum || "0"),
          returningUsersSum: parseInt(summaryStats?.returningUsersSum || "0"),
          mobileUsersSum: parseInt(summaryStats?.mobileUsersSum || "0"),
          desktopUsersSum: parseInt(summaryStats?.desktopUsersSum || "0"),
          avgBounceRate: parseFloat(summaryStats?.avgBounceRate || "0"),
          maxVisitors: parseInt(summaryStats?.maxVisitors || "0"),
          minVisitors: parseInt(summaryStats?.minVisitors || "0"),
          maxPageViews: parseInt(summaryStats?.maxPageViews || "0"),
          minPageViews: parseInt(summaryStats?.minPageViews || "0"),
          averageVisitorsPerDay:
            totalCount > 0
              ? Math.round(
                  parseInt(summaryStats?.totalVisitorsSum || "0") / totalCount
                )
              : 0,
          averagePageViewsPerDay:
            totalCount > 0
              ? Math.round(
                  parseInt(summaryStats?.totalPageViewsSum || "0") / totalCount
                )
              : 0,
        },
        dateRange: {
          earliest: dateRange?.earliestDate,
          latest: dateRange?.latestDate,
          totalDays: totalCount,
        },
        trends: {
          monthlyTrends: monthlyTrends.map((trend: any) => ({
            month: trend.month, // Will be in format "2024-01"
            visitors: parseInt(trend.monthlyVisitors || "0"),
            pageViews: parseInt(trend.monthlyPageViews || "0"),
            newUsers: parseInt(trend.monthlyNewUsers || "0"),
            bounceRate: parseFloat(trend.monthlyBounceRate || "0"),
          })),
          growthRates: {
            visitors: visitorsGrowthRate,
            pageViews: pageViewsGrowthRate,
            comparisonPeriod: {
              current: {
                visitors: currentTotalVisitors,
                pageViews: currentTotalPageViews,
              },
              previous: {
                visitors: previousTotalVisitors,
                pageViews: previousTotalPageViews,
              },
            },
          },
        },
        breakdowns: {
          deviceBreakdown: {
            mobile: parseInt(deviceBreakdown?.totalMobileUsers || "0"),
            desktop: parseInt(deviceBreakdown?.totalDesktopUsers || "0"),
            mobilePercentage:
              parseInt(deviceBreakdown?.totalMobileUsers || "0") +
                parseInt(deviceBreakdown?.totalDesktopUsers || "0") >
              0
                ? (parseInt(deviceBreakdown?.totalMobileUsers || "0") /
                    (parseInt(deviceBreakdown?.totalMobileUsers || "0") +
                      parseInt(deviceBreakdown?.totalDesktopUsers || "0"))) *
                  100
                : 0,
            desktopPercentage:
              parseInt(deviceBreakdown?.totalMobileUsers || "0") +
                parseInt(deviceBreakdown?.totalDesktopUsers || "0") >
              0
                ? (parseInt(deviceBreakdown?.totalDesktopUsers || "0") /
                    (parseInt(deviceBreakdown?.totalMobileUsers || "0") +
                      parseInt(deviceBreakdown?.totalDesktopUsers || "0"))) *
                  100
                : 0,
          },
          userTypeBreakdown: {
            newUsers: parseInt(userTypeBreakdown?.totalNewUsers || "0"),
            returningUsers: parseInt(
              userTypeBreakdown?.totalReturningUsers || "0"
            ),
            newUsersPercentage:
              parseInt(userTypeBreakdown?.totalNewUsers || "0") +
                parseInt(userTypeBreakdown?.totalReturningUsers || "0") >
              0
                ? (parseInt(userTypeBreakdown?.totalNewUsers || "0") /
                    (parseInt(userTypeBreakdown?.totalNewUsers || "0") +
                      parseInt(
                        userTypeBreakdown?.totalReturningUsers || "0"
                      ))) *
                  100
                : 0,
            returningUsersPercentage:
              parseInt(userTypeBreakdown?.totalNewUsers || "0") +
                parseInt(userTypeBreakdown?.totalReturningUsers || "0") >
              0
                ? (parseInt(userTypeBreakdown?.totalReturningUsers || "0") /
                    (parseInt(userTypeBreakdown?.totalNewUsers || "0") +
                      parseInt(
                        userTypeBreakdown?.totalReturningUsers || "0"
                      ))) *
                  100
                : 0,
          },
        },
        appliedFilters: {
          search,
          dateFrom,
          dateTo,
          minVisitors: minVisitors ? parseInt(minVisitors) : undefined,
          maxVisitors: maxVisitors ? parseInt(maxVisitors) : undefined,
          minPageViews: minPageViews ? parseInt(minPageViews) : undefined,
          maxPageViews: maxPageViews ? parseInt(maxPageViews) : undefined,
          deviceFilter,
        },
        appliedSort: {
          field: sortBy,
          order: sortOrder,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("💥 Error fetching daily stats:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat mengambil data daily stats",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
