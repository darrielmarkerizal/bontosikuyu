import { NextRequest, NextResponse } from "next/server";
import { Op, fn, col } from "sequelize";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";

// Define interfaces for dashboard data
interface DashboardOverview {
  totalArticles: number;
  totalUmkm: number;
  totalTravels: number;
  totalWriters: number;
  totalUsers: number;
  totalSessions: number;
  totalPageViews: number;
  activeSessions: number;
}

interface RecentActivity {
  recentArticles: Array<{
    id: number;
    title: string;
    status: string;
    createdAt: string;
    writerName: string;
  }>;
  recentUmkm: Array<{
    id: number;
    umkmName: string;
    ownerName: string;
    dusun: string;
    createdAt: string;
  }>;
  recentTravels: Array<{
    id: number;
    name: string;
    dusun: string;
    createdAt: string;
  }>;
  topWriters: Array<{
    id: number;
    fullName: string;
    dusun: string;
    articleCount: number;
  }>;
  recentLogs: Array<{
    id: number;
    action: string;
    description: string;
    tableName: string;
    recordId: number | null;
    userId: number | null;
    ipAddress: string | null;
    createdAt: string;
  }>;
}

interface QuickStats {
  articlesByStatus: {
    published: number;
    draft: number;
  };
  umkmByDusun: Record<string, number>;
  travelsByDusun: Record<string, number>;
  writersByDusun: Record<string, number>;
  topPerformingArticles: Array<{
    id: number;
    title: string;
    pageViews: number;
  }>;
}

interface TrafficInsights {
  todayStats: {
    sessions: number;
    pageViews: number;
    uniqueVisitors: number;
  };
  weeklyGrowth: {
    sessions: number;
    pageViews: number;
  };
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  topPages: Array<{
    page: string;
    views: number;
  }>;
}

interface DashboardData {
  overview: DashboardOverview;
  recentActivity: RecentActivity;
  quickStats: QuickStats;
  trafficInsights: TrafficInsights;
  lastUpdated: string;
}

// Define interfaces for Sequelize models
interface SequelizeModel {
  dataValues?: Record<string, unknown>;
  [key: string]: unknown;
}

interface ArticleModel extends SequelizeModel {
  id: number;
  title: string;
  status: string;
  createdAt: string;
  writer?: WriterModel;
}

interface WriterModel extends SequelizeModel {
  fullName: string;
}

interface UmkmModel extends SequelizeModel {
  id: number;
  umkmName: string;
  ownerName: string;
  dusun: string;
  createdAt: string;
}

interface TravelModel extends SequelizeModel {
  id: number;
  name: string;
  dusun: string;
  createdAt: string;
}

interface LogModel extends SequelizeModel {
  id: number;
  action: string;
  description: string;
  tableName: string;
  recordId: number | null;
  userId: number | null;
  ipAddress: string | null;
  createdAt: string;
}

interface StatusCountModel extends SequelizeModel {
  status: string;
  count: string | number;
}

interface DusunCountModel extends SequelizeModel {
  dusun: string;
  count: string | number;
}

interface DeviceCountModel extends SequelizeModel {
  deviceType: string;
  count: string | number;
}

interface PageViewCountModel extends SequelizeModel {
  page: string;
  views: string | number;
}

// Add this interface after the existing interfaces (around line 165)
interface RawWriterResult {
  id: number;
  fullName: string;
  dusun: string;
  articleCount: string | number;
}

// Helper function to safely extract value
function extractValue(
  obj: SequelizeModel | null | undefined,
  key: string
): string {
  if (!obj) return "0";
  return String(obj.dataValues?.[key] ?? obj[key] ?? "0");
}

// Main GET function
export async function GET(request: NextRequest) {
  try {
    console.log("📊 Getting dashboard data");
    const startTime = Date.now();

    // Verify JWT token using existing auth utilities
    const token = getTokenFromRequest(request);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Token tidak ditemukan",
          error: "No authentication token provided",
        },
        { status: 401 }
      );
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Token tidak valid",
          error: "Invalid or expired token",
        },
        { status: 401 }
      );
    }

    console.log(
      `✅ Authenticated user: ${decodedToken.username} (${decodedToken.fullName})`
    );

    // Import sequelize and models directly
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const sequelize = require("../../../../../config/database");

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

    // Import models directly and set up associations manually
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { DataTypes } = require("sequelize");

    const Article = require("../../../../../models/article.js")(
      sequelize,
      DataTypes
    );
    const Umkm = require("../../../../../models/umkm.js")(sequelize, DataTypes);
    const Travel = require("../../../../../models/travel.js")(
      sequelize,
      DataTypes
    );
    const Writer = require("../../../../../models/writer.js")(
      sequelize,
      DataTypes
    );
    const User = require("../../../../../models/user.js")(sequelize, DataTypes);
    const AnalyticsSession =
      require("../../../../../models/analyticssession.js")(
        sequelize,
        DataTypes
      );
    const PageView = require("../../../../../models/pageview.js")(
      sequelize,
      DataTypes
    );
    const Log = require("../../../../../models/log.js")(sequelize, DataTypes);
    const CategoryArticle = require("../../../../../models/categoryarticle.js")(
      sequelize,
      DataTypes
    );
    const CategoryUmkm = require("../../../../../models/categoryumkm.js")(
      sequelize,
      DataTypes
    );
    const TravelCategory = require("../../../../../models/travelcategory.js")(
      sequelize,
      DataTypes
    );

    // Set up associations manually
    Article.belongsTo(CategoryArticle, {
      foreignKey: "articleCategoryId",
      as: "category",
    });
    Article.belongsTo(Writer, {
      foreignKey: "writerId",
      as: "writer",
    });
    Writer.hasMany(Article, {
      foreignKey: "writerId",
      as: "articles",
    });

    Umkm.belongsTo(CategoryUmkm, {
      foreignKey: "umkmCategoryId",
      as: "category",
    });

    Travel.belongsTo(TravelCategory, {
      foreignKey: "travelCategoryId",
      as: "category",
    });

    // Calculate date ranges
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const previousWeekStart = new Date(
      weekAgo.getTime() - 7 * 24 * 60 * 60 * 1000
    );

    // Execute parallel queries for dashboard data
    const [
      // Overview counts
      totalArticles,
      totalUmkm,
      totalTravels,
      totalWriters,
      totalUsers,
      totalSessions,
      totalPageViews,
      activeSessions,

      // Recent activity
      recentArticles,
      recentUmkm,
      recentTravels,
      topWriters,
      recentLogs,

      // Quick stats
      articlesByStatus,
      umkmByDusun,
      travelsByDusun,
      writersByDusun,

      // Traffic insights
      todaySessions,
      todayPageViews,
      todayUniqueVisitors,
      weeklySessions,
      previousWeekSessions,
      weeklyPageViews,
      previousWeekPageViews,
      deviceBreakdown,
      topPages,
    ] = await Promise.all([
      // Overview counts
      Article.count(),
      Umkm.count(),
      Travel.count(),
      Writer.count(),
      User.count(),
      AnalyticsSession.count(),
      PageView.count(),
      AnalyticsSession.count({
        where: {
          [Op.or]: [
            { endTime: null },
            { endTime: { [Op.gte]: new Date(now.getTime() - 30 * 60 * 1000) } },
          ],
        },
      }),

      // Recent activity (last 5 items each)
      Article.findAll({
        attributes: ["id", "title", "status", "createdAt"],
        include: [
          {
            model: Writer,
            as: "writer",
            attributes: ["fullName"],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: 5,
      }),
      Umkm.findAll({
        attributes: ["id", "umkmName", "ownerName", "dusun", "createdAt"],
        order: [["createdAt", "DESC"]],
        limit: 5,
      }),
      Travel.findAll({
        attributes: ["id", "name", "dusun", "createdAt"],
        order: [["createdAt", "DESC"]],
        limit: 5,
      }),
      // Fixed topWriters query - using raw SQL for better control
      sequelize.query(
        `
        SELECT 
          w.id,
          w.fullName,
          w.dusun,
          COUNT(a.id) as articleCount
        FROM Writers w
        LEFT JOIN Articles a ON w.id = a.writerId
        GROUP BY w.id, w.fullName, w.dusun
        ORDER BY articleCount DESC
        LIMIT 5
      `,
        { type: sequelize.QueryTypes.SELECT }
      ),
      Log.findAll({
        attributes: [
          "id",
          "action",
          "description",
          "tableName",
          "recordId",
          "userId",
          "ipAddress",
          "createdAt",
        ],
        order: [["createdAt", "DESC"]],
        limit: 10,
      }),

      // Quick stats
      Article.findAll({
        attributes: ["status", [fn("COUNT", col("id")), "count"]],
        group: ["status"],
      }),
      Umkm.findAll({
        attributes: ["dusun", [fn("COUNT", col("id")), "count"]],
        group: ["dusun"],
      }),
      Travel.findAll({
        attributes: ["dusun", [fn("COUNT", col("id")), "count"]],
        group: ["dusun"],
      }),
      Writer.findAll({
        attributes: ["dusun", [fn("COUNT", col("id")), "count"]],
        group: ["dusun"],
      }),

      // Traffic insights
      AnalyticsSession.count({
        where: { createdAt: { [Op.gte]: todayStart } },
      }),
      PageView.count({
        where: { createdAt: { [Op.gte]: todayStart } },
      }),
      AnalyticsSession.count({
        where: {
          createdAt: { [Op.gte]: todayStart },
          ipAddress: { [Op.not]: null },
        },
        distinct: true,
        col: "ipAddress",
      }),
      AnalyticsSession.count({
        where: { createdAt: { [Op.gte]: weekAgo } },
      }),
      AnalyticsSession.count({
        where: {
          createdAt: {
            [Op.gte]: previousWeekStart,
            [Op.lt]: weekAgo,
          },
        },
      }),
      PageView.count({
        where: { createdAt: { [Op.gte]: weekAgo } },
      }),
      PageView.count({
        where: {
          createdAt: {
            [Op.gte]: previousWeekStart,
            [Op.lt]: weekAgo,
          },
        },
      }),
      AnalyticsSession.findAll({
        attributes: ["deviceType", [fn("COUNT", col("id")), "count"]],
        group: ["deviceType"],
      }),
      PageView.findAll({
        attributes: ["page", [fn("COUNT", col("id")), "views"]],
        group: ["page"],
        order: [[fn("COUNT", col("id")), "DESC"]],
        limit: 10,
      }),
    ]);

    // Process articles by status
    const articlesByStatusData = {
      published: 0,
      draft: 0,
    };
    (articlesByStatus as StatusCountModel[]).forEach(
      (item: StatusCountModel) => {
        const status = item.dataValues?.status || item.status;
        const count = parseInt(extractValue(item, "count"));
        if (status === "publish") {
          articlesByStatusData.published = count;
        } else if (status === "draft") {
          articlesByStatusData.draft = count;
        }
      }
    );

    // Process data by dusun
    const processDusunData = (
      data: DusunCountModel[]
    ): Record<string, number> => {
      const result: Record<string, number> = {};
      data.forEach((item: DusunCountModel) => {
        const dusun = item.dataValues?.dusun || item.dusun;
        const count = parseInt(extractValue(item, "count"));
        if (dusun) {
          result[dusun as string] = count;
        }
      });
      return result;
    };

    const umkmByDusunData = processDusunData(umkmByDusun as DusunCountModel[]);
    const travelsByDusunData = processDusunData(
      travelsByDusun as DusunCountModel[]
    );
    const writersByDusunData = processDusunData(
      writersByDusun as DusunCountModel[]
    );

    // Process device breakdown
    const deviceBreakdownData = {
      mobile: 0,
      desktop: 0,
      tablet: 0,
    };
    (deviceBreakdown as DeviceCountModel[]).forEach(
      (item: DeviceCountModel) => {
        const deviceType = item.dataValues?.deviceType || item.deviceType;
        const count = parseInt(extractValue(item, "count"));
        if (
          deviceType &&
          (deviceType === "mobile" ||
            deviceType === "desktop" ||
            deviceType === "tablet")
        ) {
          deviceBreakdownData[deviceType] = count;
        }
      }
    );

    // Calculate growth rates
    const calculateGrowth = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    // Build dashboard response
    const dashboardData: DashboardData = {
      overview: {
        totalArticles,
        totalUmkm,
        totalTravels,
        totalWriters,
        totalUsers,
        totalSessions,
        totalPageViews,
        activeSessions,
      },
      recentActivity: {
        recentArticles: (recentArticles as ArticleModel[]).map(
          (article: ArticleModel) => ({
            id: article.id,
            title: article.title,
            status: article.status,
            createdAt: article.createdAt,
            writerName: article.writer?.fullName || "Unknown",
          })
        ),
        recentUmkm: (recentUmkm as UmkmModel[]).map((umkm: UmkmModel) => ({
          id: umkm.id,
          umkmName: umkm.umkmName,
          ownerName: umkm.ownerName,
          dusun: umkm.dusun,
          createdAt: umkm.createdAt,
        })),
        recentTravels: (recentTravels as TravelModel[]).map(
          (travel: TravelModel) => ({
            id: travel.id,
            name: travel.name,
            dusun: travel.dusun,
            createdAt: travel.createdAt,
          })
        ),
        topWriters: (topWriters as RawWriterResult[]).map(
          (writer: RawWriterResult) => ({
            id: writer.id,
            fullName: writer.fullName,
            dusun: writer.dusun,
            articleCount: parseInt(String(writer.articleCount)) || 0,
          })
        ),
        recentLogs: (recentLogs as LogModel[]).map((log: LogModel) => ({
          id: log.id,
          action: log.action,
          description: log.description,
          tableName: log.tableName,
          recordId: log.recordId,
          userId: log.userId,
          ipAddress: log.ipAddress,
          createdAt: log.createdAt,
        })),
      },
      quickStats: {
        articlesByStatus: articlesByStatusData,
        umkmByDusun: umkmByDusunData,
        travelsByDusun: travelsByDusunData,
        writersByDusun: writersByDusunData,
        topPerformingArticles: (topPages as PageViewCountModel[]).map(
          (page: PageViewCountModel) => ({
            id: 0, // Page views don't have article IDs, would need to join with articles table
            title: page.page,
            pageViews: parseInt(extractValue(page, "views")),
          })
        ),
      },
      trafficInsights: {
        todayStats: {
          sessions: todaySessions,
          pageViews: todayPageViews,
          uniqueVisitors: todayUniqueVisitors,
        },
        weeklyGrowth: {
          sessions: calculateGrowth(weeklySessions, previousWeekSessions),
          pageViews: calculateGrowth(weeklyPageViews, previousWeekPageViews),
        },
        deviceBreakdown: deviceBreakdownData,
        topPages: (topPages as PageViewCountModel[]).map(
          (page: PageViewCountModel) => ({
            page: page.page,
            views: parseInt(extractValue(page, "views")),
          })
        ),
      },
      lastUpdated: new Date().toISOString(),
    };

    console.log(`✅ Dashboard data completed in ${Date.now() - startTime}ms`);

    return NextResponse.json({
      success: true,
      message: "Data dashboard berhasil diambil",
      data: dashboardData,
      user: {
        id: decodedToken.id,
        username: decodedToken.username,
        fullName: decodedToken.fullName,
        email: decodedToken.email,
      },
      performance: {
        queryTime: `${Date.now() - startTime}ms`,
        optimized: true,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("💥 Error fetching dashboard data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat mengambil data dashboard",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
