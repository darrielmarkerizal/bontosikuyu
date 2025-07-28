import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";

// Define proper interfaces for Sequelize models
interface UmkmModel {
  id: number;
  umkmName: string;
  ownerName: string;
  umkmCategoryId: number;
  dusun:
    | "Dusun Laiyolo"
    | "Dusun Pangkaje'ne"
    | "Dusun Timoro"
    | "Dusun Kilotepo";
  phone: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  category?: CategoryUmkmModel;
  getDataValue(key: string): unknown;
}

interface CategoryUmkmModel {
  id: number;
  name: string;
}

interface DusunCountModel {
  dusun: string;
  getDataValue(key: string): unknown;
}

interface SequelizeValidationError extends Error {
  name: "SequelizeValidationError";
  errors: Array<{
    path: string;
    message: string;
  }>;
}

export async function GET(request: NextRequest) {
  try {
    // Import sequelize and models directly
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const sequelize = require("../../../../../config/database");

    // Test database connection
    try {
      await sequelize.authenticate();
      console.log("Database connection has been established successfully.");
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

    // Import models directly
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Umkm = require("../../../../../models/umkm.js")(
      sequelize,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("sequelize").DataTypes
    );
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const CategoryUmkm = require("../../../../../models/categoryumkm.js")(
      sequelize,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("sequelize").DataTypes
    );

    // Set up associations
    Umkm.belongsTo(CategoryUmkm, {
      foreignKey: "umkmCategoryId",
      as: "category",
    });

    // Parse query parameters
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Filters
    const search = searchParams.get("search") || undefined;
    const dusun = searchParams.get("dusun") || undefined;
    const categoryId = searchParams.get("categoryId")
      ? parseInt(searchParams.get("categoryId")!)
      : undefined;

    // Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder =
      (searchParams.get("sortOrder") as "ASC" | "DESC") || "DESC";

    // Get overall stats FIRST (always the same, regardless of filters)
    const overallTotalCount = await Umkm.count();
    const overallDusunCounts = await Umkm.findAll({
      attributes: [
        "dusun",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["dusun"],
    });

    // Build where clause for filtered data
    const whereClause: Record<string, unknown> = {};

    if (search) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (whereClause as any)[Op.or] = [
        { umkmName: { [Op.like]: `%${search}%` } },
        { ownerName: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
      ];
    }

    if (dusun) {
      whereClause.dusun = dusun;
    }

    if (categoryId) {
      whereClause.umkmCategoryId = categoryId;
    }

    // Get total count for filtered data
    const totalCount = await Umkm.count({
      where: whereClause,
    });

    // Return 404 if no data found
    if (totalCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Tidak ada data UMKM yang ditemukan",
        },
        { status: 404 }
      );
    }

    // Get UMKM with associations (filtered)
    const umkmList = await Umkm.findAll({
      where: whereClause,
      include: [
        {
          model: CategoryUmkm,
          as: "category",
          attributes: ["id", "name"],
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

    // Get filter options (always all categories)
    const categories = await CategoryUmkm.findAll({
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });

    // Get dusun options
    const dusunOptions = [
      "Dusun Laiyolo",
      "Dusun Pangkaje'ne",
      "Dusun Timoro",
      "Dusun Kilotepo",
    ];

    return NextResponse.json({
      success: true,
      message: "Data UMKM berhasil diambil",
      data: {
        umkm: umkmList.map((umkm: UmkmModel) => ({
          id: umkm.id,
          umkmName: umkm.umkmName,
          ownerName: umkm.ownerName,
          dusun: umkm.dusun,
          phone: umkm.phone,
          image: umkm.image,
          category: umkm.category,
          createdAt: umkm.createdAt,
          updatedAt: umkm.updatedAt,
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
          categories,
          dusunOptions,
          dusunCounts: overallDusunCounts.reduce(
            (acc: Record<string, number>, item: DusunCountModel) => {
              acc[item.dusun] = parseInt(item.getDataValue("count") as string);
              return acc;
            },
            {}
          ),
        },
        appliedFilters: {
          search,
          dusun,
          categoryId,
        },
        appliedSort: {
          field: sortBy,
          order: sortOrder,
        },
        // Always include overall stats (never changes)
        overallStats: {
          totalUmkm: overallTotalCount,
          dusunCounts: overallDusunCounts.reduce(
            (acc: Record<string, number>, item: DusunCountModel) => {
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
    console.error("Error fetching UMKM:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat mengambil data UMKM",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Import sequelize and models directly
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const sequelize = require("../../../../../config/database");

    // Test database connection
    try {
      await sequelize.authenticate();
      console.log("Database connection has been established successfully.");
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

    // Import models directly
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Umkm = require("../../../../../models/umkm.js")(
      sequelize,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("sequelize").DataTypes
    );
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const CategoryUmkm = require("../../../../../models/categoryumkm.js")(
      sequelize,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("sequelize").DataTypes
    );

    // Set up associations
    Umkm.belongsTo(CategoryUmkm, {
      foreignKey: "umkmCategoryId",
      as: "category",
    });

    // Parse request body
    const body = await request.json();
    const { umkmName, ownerName, umkmCategoryId, dusun, phone, image } = body;

    // Validation
    if (!umkmName || !ownerName || !umkmCategoryId || !dusun || !phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Data tidak lengkap",
          errors: {
            umkmName: !umkmName ? "Nama UMKM wajib diisi" : undefined,
            ownerName: !ownerName ? "Nama pemilik wajib diisi" : undefined,
            umkmCategoryId: !umkmCategoryId
              ? "Kategori wajib dipilih"
              : undefined,
            dusun: !dusun ? "Dusun wajib dipilih" : undefined,
            phone: !phone ? "Nomor telepon wajib diisi" : undefined,
          },
        },
        { status: 400 }
      );
    }

    // Validate umkmName length
    if (umkmName.length < 2 || umkmName.length > 150) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama UMKM harus antara 2-150 karakter",
        },
        { status: 400 }
      );
    }

    // Validate ownerName length
    if (ownerName.length < 2 || ownerName.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama pemilik harus antara 2-100 karakter",
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

    // Validate phone
    if (phone.length < 10 || phone.length > 20 || !/^\d+$/.test(phone)) {
      return NextResponse.json(
        {
          success: false,
          message: "Nomor telepon harus 10-20 digit angka",
        },
        { status: 400 }
      );
    }

    // Check if category exists
    const categoryExists = await CategoryUmkm.findByPk(umkmCategoryId);
    if (!categoryExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Kategori tidak ditemukan",
        },
        { status: 400 }
      );
    }

    // Create new UMKM
    const newUmkm = await Umkm.create({
      umkmName,
      ownerName,
      umkmCategoryId,
      dusun,
      phone,
      image: image || null,
    });

    // Fetch the created UMKM with associations
    const createdUmkm = await Umkm.findByPk(newUmkm.id, {
      include: [
        {
          model: CategoryUmkm,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    });

    return NextResponse.json(
      {
        success: true,
        message: "UMKM berhasil dibuat",
        data: {
          id: createdUmkm.id,
          umkmName: createdUmkm.umkmName,
          ownerName: createdUmkm.ownerName,
          dusun: createdUmkm.dusun,
          phone: createdUmkm.phone,
          image: createdUmkm.image,
          category: createdUmkm.category,
          createdAt: createdUmkm.createdAt,
          updatedAt: createdUmkm.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating UMKM:", error);

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

    // Handle other Sequelize errors
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "SequelizeUniqueConstraintError"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Data sudah ada",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat membuat UMKM",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
