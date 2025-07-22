import { NextRequest, NextResponse } from "next/server";

// GET /api/(cms)/logs
export async function GET(req: NextRequest) {
  try {
    // Import sequelize and Log model
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const sequelize = require("../../../../../config/database");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Log = require("../../../../../models/log.js")(
      sequelize,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("sequelize").DataTypes
    );

    // Test DB connection
    try {
      await sequelize.authenticate();
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Database connection failed",
          error: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }

    // --- Query Params ---
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "DESC").toUpperCase();

    const search = searchParams.get("search") || "";
    const action = searchParams.get("action") || "";
    const userId = searchParams.get("userId") || "";

    // --- Build where clause ---
    const where: Record<string, unknown> = {};

    if (search) {
      // Search in description, userAgent, or tableName
      where["$or"] = [
        { description: { $like: `%${search}%` } },
        { userAgent: { $like: `%${search}%` } },
        { tableName: { $like: `%${search}%` } },
      ];
    }
    if (action) {
      where.action = action;
    }
    if (userId) {
      where.userId = userId;
    }

    // --- Query logs with pagination, sorting, and filter ---
    const { count, rows } = await Log.findAndCountAll({
      where,
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });

    // --- Response ---
    return NextResponse.json({
      success: true,
      message: "Berhasil mengambil data log",
      data: {
        logs: rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: limit,
          hasNextPage: offset + limit < count,
          hasPrevPage: page > 1,
        },
        filters: {
          actionOptions: [
            "CREATE",
            "UPDATE",
            "DELETE",
            "LOGIN",
            "LOGOUT",
            "VIEW",
            "DOWNLOAD",
            "UPLOAD",
          ],
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat mengambil data log",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
