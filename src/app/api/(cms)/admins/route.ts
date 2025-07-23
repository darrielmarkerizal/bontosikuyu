import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";

// Define proper interfaces for Sequelize models
interface UserModel {
  id: number;
  fullName: string;
  email: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  getDataValue(key: string): unknown;
}

// GET - Read all users with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Getting users data");

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

    // Import User model
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const User = require("../../../../../models/user.js")(
      sequelize,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("sequelize").DataTypes
    );

    // Parse query parameters
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Filters
    const search = searchParams.get("search") || undefined;

    // Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder =
      (searchParams.get("sortOrder") as "ASC" | "DESC") || "DESC";

    console.log("🔍 Query parameters:", {
      page,
      limit,
      search,
      sortBy,
      sortOrder,
    });

    // Build where clause
    const whereClause: Record<string, unknown> = {};

    if (search) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (whereClause as any)[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { username: { [Op.like]: `%${search}%` } },
      ];
    }

    // Get total count for pagination
    const totalCount = await User.count({
      where: whereClause,
    });

    console.log("📊 Total users found:", totalCount);

    // Return 404 if no data found
    if (totalCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Tidak ada data admin yang ditemukan",
        },
        { status: 404 }
      );
    }

    // Get users with filters (exclude password)
    const users = await User.findAll({
      where: whereClause,
      attributes: [
        "id",
        "fullName",
        "email",
        "username",
        "createdAt",
        "updatedAt",
      ],
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });

    // Calculate pagination
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    console.log("✅ Users data retrieved successfully");

    return NextResponse.json({
      success: true,
      message: "Data admin berhasil diambil",
      data: {
        users: users.map((user: UserModel) => ({
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          username: user.username,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
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
        appliedFilters: {
          search,
        },
        appliedSort: {
          field: sortBy,
          order: sortOrder,
        },
        overallStats: {
          totalUsers: totalCount,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("💥 Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat mengambil data admin",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST is handled by register API at /api/(auth)/register
