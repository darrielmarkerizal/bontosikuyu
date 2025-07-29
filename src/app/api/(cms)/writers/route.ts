import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

// Define proper interfaces for Sequelize models
interface WriterModel {
  id: number;
  fullName: string;
  phoneNumber: string;
  dusun:
    | "Dusun Laiyolo"
    | "Dusun Pangkaje'ne"
    | "Dusun Timoro"
    | "Dusun Kilotepo";
  createdAt: Date;
  updatedAt: Date;
  getDataValue(key: string): unknown;
}

interface SequelizeValidationError extends Error {
  name: "SequelizeValidationError";
  errors: Array<{
    path: string;
    message: string;
  }>;
}

// GET - Read all writers with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Getting writers data");

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

    // Import Writer model
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Writer = require("../../../../../models/writer.js")(
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
    const dusun = searchParams.get("dusun") || undefined;

    // Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder =
      (searchParams.get("sortOrder") as "ASC" | "DESC") || "DESC";

    console.log("🔍 Query parameters:", {
      page,
      limit,
      search,
      dusun,
      sortBy,
      sortOrder,
    });

    // Build where clause
    const whereClause: Record<string, unknown> = {};

    if (search) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (whereClause as any)[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { phoneNumber: { [Op.like]: `%${search}%` } },
      ];
    }

    if (dusun) {
      whereClause.dusun = dusun;
    }

    // Get total count for pagination
    const totalCount = await Writer.count({
      where: whereClause,
    });

    console.log("📊 Total writers found:", totalCount);

    // Return 404 if no data found
    if (totalCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Tidak ada data penulis yang ditemukan",
        },
        { status: 404 }
      );
    }

    // Get writers with filters
    const writers = await Writer.findAll({
      where: whereClause,
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });

    // Calculate pagination
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Get filter options for frontend
    const dusunOptions = [
      "Dusun Laiyolo",
      "Dusun Pangkaje'ne",
      "Dusun Timoro",
      "Dusun Kilotepo",
    ];

    // Get dusun counts for statistics
    const dusunCounts = await Writer.findAll({
      attributes: [
        "dusun",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["dusun"],
    });

    console.log("✅ Writers data retrieved successfully");

    return NextResponse.json({
      success: true,
      message: "Data penulis berhasil diambil",
      data: {
        writers: writers.map((writer: WriterModel) => ({
          id: writer.id,
          fullName: writer.fullName,
          phoneNumber: writer.phoneNumber,
          dusun: writer.dusun,
          createdAt: writer.createdAt,
          updatedAt: writer.updatedAt,
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
          dusunOptions,
          dusunCounts: dusunCounts.reduce(
            (acc: Record<string, number>, item: WriterModel) => {
              acc[item.dusun] = parseInt(item.getDataValue("count") as string);
              return acc;
            },
            {}
          ),
        },
        appliedFilters: {
          search,
          dusun,
        },
        appliedSort: {
          field: sortBy,
          order: sortOrder,
        },
        overallStats: {
          totalWriters: totalCount,
          dusunCounts: dusunCounts.reduce(
            (acc: Record<string, number>, item: WriterModel) => {
              acc[item.dusun] = parseInt(item.getDataValue("count") as string);
              return acc;
            },
            {}
          ),
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("💥 Error fetching writers:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat mengambil data penulis",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST - Create new writer
export async function POST(request: NextRequest) {
  try {
    console.log("➕ Creating new writer");

    // Verify JWT token for authentication
    const token = getTokenFromRequest(request);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Token autentikasi diperlukan",
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
          message: "Token autentikasi tidak valid",
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

    // Import Writer model
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Writer = require("../../../../../models/writer.js")(
      sequelize,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("sequelize").DataTypes
    );

    // Parse request body
    const body = await request.json();
    const { fullName, phoneNumber, dusun } = body;

    console.log("📝 Request body:", { fullName, phoneNumber, dusun });

    // Validation
    if (!fullName || !phoneNumber || !dusun) {
      console.error("❌ Missing required fields");
      return NextResponse.json(
        {
          success: false,
          message: "Data tidak lengkap",
          errors: {
            fullName: !fullName ? "Nama lengkap wajib diisi" : undefined,
            phoneNumber: !phoneNumber ? "Nomor telepon wajib diisi" : undefined,
            dusun: !dusun ? "Dusun wajib dipilih" : undefined,
          },
        },
        { status: 400 }
      );
    }

    // Validate fullName length
    if (fullName.length < 2 || fullName.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama lengkap harus antara 2-100 karakter",
        },
        { status: 400 }
      );
    }

    // Validate phoneNumber format and length
    if (
      !/^\d+$/.test(phoneNumber) ||
      phoneNumber.length < 10 ||
      phoneNumber.length > 20
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Nomor telepon harus berupa angka dan antara 10-20 digit",
        },
        { status: 400 }
      );
    }

    // Validate dusun
    const validDusun = [
      "Dusun Laiyolo",
      "Dusun Pangkaje'ne",
      "Dusun Timoro",
      "Dusun Kilotepo",
    ];
    if (!validDusun.includes(dusun)) {
      return NextResponse.json(
        {
          success: false,
          message: "Dusun tidak valid",
        },
        { status: 400 }
      );
    }

    // Check if phone number already exists
    const existingPhone = await Writer.findOne({ where: { phoneNumber } });
    if (existingPhone) {
      return NextResponse.json(
        {
          success: false,
          message: "Nomor telepon sudah terdaftar",
        },
        { status: 409 }
      );
    }

    // Create new writer
    const newWriter = await Writer.create({
      fullName,
      phoneNumber,
      dusun,
    });

    console.log("✅ Writer created successfully:", newWriter.id);

    return NextResponse.json(
      {
        success: true,
        message: "Penulis berhasil dibuat",
        data: {
          id: newWriter.id,
          fullName: newWriter.fullName,
          phoneNumber: newWriter.phoneNumber,
          dusun: newWriter.dusun,
          createdAt: newWriter.createdAt,
          updatedAt: newWriter.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("💥 Error creating writer:", error);

    // Handle Sequelize validation errors
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "SequelizeValidationError"
    ) {
      const validationErrors = (error as SequelizeValidationError).errors.map(
        (err) => ({
          field: err.path,
          message: err.message,
        })
      );

      return NextResponse.json(
        {
          success: false,
          message: "Validasi gagal",
          errors: validationErrors,
        },
        { status: 400 }
      );
    }

    // Handle unique constraint errors
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "SequelizeUniqueConstraintError"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Nomor telepon sudah terdaftar",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat membuat penulis",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
