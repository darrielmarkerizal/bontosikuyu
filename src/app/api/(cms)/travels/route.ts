import { NextRequest, NextResponse } from "next/server";
import { getModels } from "@/lib/models";
import { Op } from "sequelize";
import type { WhereOptions } from "sequelize";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import sequelize from "../../../../../config/database";
import { DataTypes } from "sequelize";

// Define types for better type safety
type WhereConditions = WhereOptions;

interface TravelWithCategory {
  id: number;
  name: string;
  dusun: string;
  image: string | null;
  travelCategoryId: number;
  category: {
    id: number;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface CategoryData {
  id: number;
  name: string;
}

interface DusunOption {
  dusun: string;
}

interface DusunCount {
  dusun: string;
  count: string;
}

interface CategoryCount {
  travelCategoryId: number;
  count: string;
  "category.name": string;
}

// Helper function to create log entry
async function createLog(
  action: "CREATE" | "UPDATE" | "DELETE",
  tableName: string,
  recordId: number,
  userId: number,
  oldValues?: Record<string, unknown>,
  newValues?: Record<string, unknown>,
  description?: string,
  request?: NextRequest
) {
  try {
    const Log = require("../../../../../models/log.js")(sequelize, DataTypes);

    const logData: Record<string, unknown> = {
      action,
      tableName,
      recordId,
      userId,
      description,
    };

    if (oldValues) {
      logData.oldValues = JSON.stringify(oldValues);
    }

    if (newValues) {
      logData.newValues = JSON.stringify(newValues);
    }

    if (request) {
      const forwarded = request.headers.get("x-forwarded-for");
      const realIp = request.headers.get("x-real-ip");
      logData.ipAddress = forwarded?.split(",")[0] || realIp || "unknown";
      logData.userAgent = request.headers.get("user-agent") || "unknown";
    }

    await Log.create(logData);
    console.log(`📝 Log created: ${action} on ${tableName} (ID: ${recordId})`);
  } catch (error) {
    console.error("Error creating log:", error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { Travel, TravelCategory } = await getModels();
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const dusun = searchParams.get("dusun") || "";
    const categoryId = searchParams.get("categoryId") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (
      searchParams.get("sortOrder") || "DESC"
    ).toUpperCase() as "ASC" | "DESC";

    // Validate pagination
    const validatedPage = Math.max(1, page);
    const validatedLimit = Math.min(Math.max(1, limit), 100); // Max 100 items per page
    const offset = (validatedPage - 1) * validatedLimit;

    // Build where conditions - FIX: Now properly typed
    const whereConditions: WhereConditions = {};

    // Search by name
    if (search && search.trim()) {
      whereConditions.name = {
        [Op.iLike]: `%${search.trim()}%`,
      };
    }

    // Filter by dusun
    if (dusun && dusun.trim() && dusun !== "all") {
      whereConditions.dusun = dusun.trim();
    }

    // Filter by category
    if (categoryId && categoryId.trim() && categoryId !== "all") {
      const parsedCategoryId = parseInt(categoryId);
      if (!isNaN(parsedCategoryId)) {
        whereConditions.travelCategoryId = parsedCategoryId;
      }
    }

    // Validate sort field
    const validSortFields = ["id", "name", "dusun", "createdAt", "updatedAt"];
    const validatedSortBy = validSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    console.log("🔍 Fetching travels with params:", {
      page: validatedPage,
      limit: validatedLimit,
      search,
      dusun,
      categoryId,
      sortBy: validatedSortBy,
      sortOrder,
      whereConditions,
    });

    // Execute query with pagination
    const { count, rows: travels } = await Travel.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: TravelCategory,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
      order: [[validatedSortBy, sortOrder]],
      limit: validatedLimit,
      offset: offset,
      distinct: true,
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / validatedLimit);
    const hasNextPage = validatedPage < totalPages;
    const hasPrevPage = validatedPage > 1;

    // Get filter options
    const [categories, dusunOptions] = await Promise.all([
      TravelCategory.findAll({
        attributes: ["id", "name"],
        order: [["name", "ASC"]],
      }) as Promise<CategoryData[]>,
      Travel.findAll({
        attributes: ["dusun"],
        group: ["dusun"],
        order: [["dusun", "ASC"]],
      }) as Promise<DusunOption[]>,
    ]);

    // Count by dusun for stats
    const dusunCounts = (await Travel.findAll({
      attributes: [
        "dusun",
        [
          Travel.sequelize!.fn("COUNT", Travel.sequelize!.col("Travel.id")),
          "count",
        ],
      ],
      group: ["dusun"],
      raw: true,
    })) as unknown as DusunCount[];

    // Count by category for stats
    const categoryCounts = (await Travel.findAll({
      attributes: [
        "travelCategoryId",
        [
          Travel.sequelize!.fn("COUNT", Travel.sequelize!.col("Travel.id")),
          "count",
        ],
      ],
      include: [
        {
          model: TravelCategory,
          as: "category",
          attributes: ["name"],
        },
      ],
      group: ["travelCategoryId", "category.id", "category.name"],
      raw: true,
    })) as unknown as CategoryCount[];

    const response = {
      success: true,
      message:
        count > 0
          ? "Data travel berhasil diambil"
          : "Tidak ada data travel ditemukan",
      data: {
        travels: (travels as TravelWithCategory[]).map((travel) => ({
          id: travel.id,
          name: travel.name,
          dusun: travel.dusun,
          image: travel.image,
          category: travel.category,
          createdAt: travel.createdAt,
          updatedAt: travel.updatedAt,
        })),
        pagination: {
          currentPage: validatedPage,
          totalPages,
          totalItems: count,
          itemsPerPage: validatedLimit,
          hasNextPage,
          hasPrevPage,
          nextPage: hasNextPage ? validatedPage + 1 : null,
          prevPage: hasPrevPage ? validatedPage - 1 : null,
        },
        appliedFilters: {
          search: search || undefined,
          dusun: dusun || undefined,
          categoryId: categoryId || undefined,
        },
        appliedSort: {
          field: validatedSortBy,
          order: sortOrder,
        },
        filters: {
          categories: categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
          })),
          dusunOptions: dusunOptions.map((item) => item.dusun),
        },
        overallStats: {
          totalTravels: count,
          dusunCounts: dusunCounts.reduce(
            (acc: Record<string, number>, item) => {
              acc[item.dusun] = parseInt(item.count);
              return acc;
            },
            {}
          ),
          categoryCounts: categoryCounts.reduce(
            (acc: Record<string, number>, item) => {
              const categoryName = item["category.name"];
              acc[categoryName] = parseInt(item.count);
              return acc;
            },
            {}
          ),
        },
      },
      timestamp: new Date().toISOString(),
    };

    console.log("✅ Travels fetched successfully:", {
      count,
      page: validatedPage,
      totalPages,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("💥 Error fetching travels:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data travel",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const { Travel, TravelCategory } = await getModels();
    const body = await request.json();

    console.log("➕ Creating new travel:", body);

    // Validate required fields
    const { name, dusun, image, travelCategoryId } = body;

    if (!name || !dusun || !travelCategoryId) {
      return NextResponse.json(
        {
          success: false,
          message: "Field name, dusun, dan travelCategoryId wajib diisi",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Validate dusun enum
    const validDusuns = [
      "Dusun Laiyolo",
      "Dusun Pangkaje'ne",
      "Dusun Timoro",
      "Dusun Kilotepo",
    ];

    if (!validDusuns.includes(dusun)) {
      return NextResponse.json(
        {
          success: false,
          message: "Dusun tidak valid",
          validOptions: validDusuns,
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Validate category exists
    const category = await TravelCategory.findByPk(travelCategoryId, {
      attributes: ["id", "name"],
    });
    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Kategori travel tidak ditemukan",
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // Check if travel name already exists in the same dusun
    const existingTravel = await Travel.findOne({
      where: {
        name: name.trim(),
        dusun: dusun,
      },
    });

    if (existingTravel) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama travel sudah ada di dusun yang sama",
          timestamp: new Date().toISOString(),
        },
        { status: 409 }
      );
    }

    // Validate image URL if provided
    if (image && image.trim()) {
      try {
        new URL(image.trim());
      } catch {
        return NextResponse.json(
          {
            success: false,
            message: "URL gambar tidak valid",
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
      }
    }

    // Create new travel
    const newTravel = await Travel.create({
      name: name.trim(),
      dusun,
      image: image?.trim() || null,
      travelCategoryId: parseInt(travelCategoryId),
    });

    // Fetch the created travel with category
    const createdTravel = (await Travel.findByPk(newTravel.id, {
      include: [
        {
          model: TravelCategory,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    })) as TravelWithCategory;

    // Create log entry for CREATE action
    await createLog(
      "CREATE",
      "travels",
      newTravel.id,
      decodedToken.id,
      undefined, // No old values for CREATE
      {
        id: createdTravel.id,
        name: createdTravel.name,
        dusun: createdTravel.dusun,
        image: createdTravel.image,
        travelCategoryId: createdTravel.travelCategoryId,
        category: createdTravel.category?.name,
      },
      `Destinasi wisata "${name}" berhasil dibuat oleh ${decodedToken.fullName}`,
      request
    );

    console.log("✅ Travel created successfully:", newTravel.id);

    return NextResponse.json({
      success: true,
      message: "Travel berhasil ditambahkan",
      data: {
        travel: {
          id: createdTravel.id,
          name: createdTravel.name,
          dusun: createdTravel.dusun,
          image: createdTravel.image,
          category: createdTravel.category,
          createdAt: createdTravel.createdAt,
          updatedAt: createdTravel.updatedAt,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("💥 Error creating travel:", error);

    if (error instanceof Error) {
      // Handle Sequelize validation errors
      if (error.name === "SequelizeValidationError") {
        return NextResponse.json(
          {
            success: false,
            message: "Data tidak valid",
            error: error.message,
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menambahkan travel",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
