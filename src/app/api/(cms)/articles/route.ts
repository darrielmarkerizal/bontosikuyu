import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";

// Define proper interfaces for Sequelize models
interface ArticleModel {
  id: number;
  title: string;
  content: string;
  status: "draft" | "publish";
  imageUrl?: string;
  articleCategoryId: number;
  writerId: number;
  createdAt: Date;
  updatedAt: Date;
  category?: CategoryModel;
  writer?: WriterModel;
  getDataValue(key: string): unknown;
}

interface CategoryModel {
  id: number;
  name: string;
}

interface WriterModel {
  id: number;
  fullName: string;
  dusun: string;
}

interface StatusCountModel {
  status: string;
  getDataValue(key: string): unknown;
}

// Add these interfaces at the top of the file
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
    const Article = require("../../../../../models/article.js")(
      sequelize,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("sequelize").DataTypes
    );
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const CategoryArticle = require("../../../../../models/categoryarticle.js")(
      sequelize,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("sequelize").DataTypes
    );
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Writer = require("../../../../../models/writer.js")(
      sequelize,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("sequelize").DataTypes
    );

    // Set up associations
    Article.belongsTo(CategoryArticle, {
      foreignKey: "articleCategoryId",
      as: "category",
    });
    Article.belongsTo(Writer, {
      foreignKey: "writerId",
      as: "writer",
    });

    // Parse query parameters
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Filters
    const search = searchParams.get("search") || undefined;
    const status =
      (searchParams.get("status") as "draft" | "publish") || undefined;
    const categoryId = searchParams.get("categoryId")
      ? parseInt(searchParams.get("categoryId")!)
      : undefined;

    // Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder =
      (searchParams.get("sortOrder") as "ASC" | "DESC") || "DESC";

    // Get overall stats FIRST (always the same, regardless of filters)
    const overallTotalCount = await Article.count();
    const overallStatusCounts = await Article.findAll({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["status"],
    });

    // Build where clause for filtered data
    const whereClause: Record<string, unknown> = {};

    if (search) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (whereClause as any)[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } },
      ];
    }

    if (status) {
      whereClause.status = status;
    }

    if (categoryId) {
      whereClause.articleCategoryId = categoryId;
    }

    // Get total count for filtered data
    const totalCount = await Article.count({
      where: whereClause,
    });

    // Return 404 if no data found
    if (totalCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Tidak ada data artikel yang ditemukan",
        },
        { status: 404 }
      );
    }

    // Get articles with associations (filtered)
    const articles = await Article.findAll({
      where: whereClause,
      include: [
        {
          model: CategoryArticle,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: Writer,
          as: "writer",
          attributes: ["id", "fullName", "dusun"],
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
    const categories = await CategoryArticle.findAll({
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });

    return NextResponse.json({
      success: true,
      message: "Data artikel berhasil diambil",
      data: {
        articles: articles.map((article: ArticleModel) => ({
          id: article.id,
          title: article.title,
          content: article.content,
          status: article.status,
          imageUrl: article.imageUrl,
          category: article.category,
          writer: article.writer,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
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
          statusCounts: overallStatusCounts.reduce(
            (acc: Record<string, number>, item: StatusCountModel) => {
              acc[item.status] = parseInt(item.getDataValue("count") as string);
              return acc;
            },
            {}
          ),
        },
        appliedFilters: {
          search,
          status,
          categoryId,
        },
        appliedSort: {
          field: sortBy,
          order: sortOrder,
        },
        // Always include overall stats (never changes)
        overallStats: {
          totalArticles: overallTotalCount,
          statusCounts: overallStatusCounts.reduce(
            (acc: Record<string, number>, item: StatusCountModel) => {
              acc[item.status] = parseInt(item.getDataValue("count") as string);
              return acc;
            },
            {}
          ),
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat mengambil data artikel",
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
    const Article = require("../../../../../models/article.js")(
      sequelize,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("sequelize").DataTypes
    );
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const CategoryArticle = require("../../../../../models/categoryarticle.js")(
      sequelize,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("sequelize").DataTypes
    );
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Writer = require("../../../../../models/writer.js")(
      sequelize,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("sequelize").DataTypes
    );

    // Set up associations
    Article.belongsTo(CategoryArticle, {
      foreignKey: "articleCategoryId",
      as: "category",
    });
    Article.belongsTo(Writer, {
      foreignKey: "writerId",
      as: "writer",
    });

    // Parse request body
    const body = await request.json();
    const { title, content, status, imageUrl, articleCategoryId, writerId } =
      body;

    // Validation
    if (!title || !content || !articleCategoryId || !writerId) {
      return NextResponse.json(
        {
          success: false,
          message: "Data tidak lengkap",
          errors: {
            title: !title ? "Judul artikel wajib diisi" : undefined,
            content: !content ? "Konten artikel wajib diisi" : undefined,
            articleCategoryId: !articleCategoryId
              ? "Kategori wajib dipilih"
              : undefined,
            writerId: !writerId ? "Penulis wajib dipilih" : undefined,
          },
        },
        { status: 400 }
      );
    }

    // Validate title length
    if (title.length < 3 || title.length > 255) {
      return NextResponse.json(
        {
          success: false,
          message: "Judul artikel harus antara 3-255 karakter",
        },
        { status: 400 }
      );
    }

    // Validate content length
    if (content.length < 10) {
      return NextResponse.json(
        {
          success: false,
          message: "Konten artikel minimal 10 karakter",
        },
        { status: 400 }
      );
    }

    // Validate status
    if (status && !["draft", "publish"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Status harus draft atau publish",
        },
        { status: 400 }
      );
    }

    // Check if category exists
    const categoryExists = await CategoryArticle.findByPk(articleCategoryId);
    if (!categoryExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Kategori tidak ditemukan",
        },
        { status: 400 }
      );
    }

    // Check if writer exists
    const writerExists = await Writer.findByPk(writerId);
    if (!writerExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Penulis tidak ditemukan",
        },
        { status: 400 }
      );
    }

    // Create new article
    const newArticle = await Article.create({
      title,
      content,
      status: status || "draft",
      imageUrl: imageUrl || null,
      articleCategoryId,
      writerId,
    });

    // Fetch the created article with associations
    const createdArticle = await Article.findByPk(newArticle.id, {
      include: [
        {
          model: CategoryArticle,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: Writer,
          as: "writer",
          attributes: ["id", "fullName", "dusun"],
        },
      ],
    });

    return NextResponse.json(
      {
        success: true,
        message: "Artikel berhasil dibuat",
        data: {
          id: createdArticle.id,
          title: createdArticle.title,
          content: createdArticle.content,
          status: createdArticle.status,
          imageUrl: createdArticle.imageUrl,
          category: createdArticle.category,
          writer: createdArticle.writer,
          createdAt: createdArticle.createdAt,
          updatedAt: createdArticle.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating article:", error);

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
        message: "Terjadi kesalahan saat membuat artikel",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
