import { NextRequest, NextResponse } from "next/server";
import { getModels } from "@/lib/models";
import { Op } from "sequelize";
import type { WhereOptions } from "sequelize";

// Define types for better type safety
// Use Sequelize's WhereOptions for type compatibility
type WhereConditions = WhereOptions<any>;

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

    // Build where conditions
    const whereConditions: WhereConditions = {};

    // Search by name - FIX: Add search functionality
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

    // Count by dusun for stats - FIX: Specify table for id column
    const dusunCounts = (await Travel.findAll({
      attributes: [
        "dusun",
        [
          Travel.sequelize!.fn("COUNT", Travel.sequelize!.col("Travel.id")),
          "count",
        ], // FIX: Travel.id instead of id
      ],
      group: ["dusun"],
      raw: true,
    })) as unknown as DusunCount[];

    // Count by category for stats - FIX: Specify table for id column
    const categoryCounts = (await Travel.findAll({
      attributes: [
        "travelCategoryId",
        [
          Travel.sequelize!.fn("COUNT", Travel.sequelize!.col("Travel.id")),
          "count",
        ], // FIX: Travel.id instead of id
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
    const category = await TravelCategory.findByPk(travelCategoryId);
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
          attributes: ["id", "name"], // FIX: Remove description
        },
      ],
    })) as TravelWithCategory;

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
