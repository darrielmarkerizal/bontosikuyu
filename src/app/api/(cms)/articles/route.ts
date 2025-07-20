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

    // Build where clause
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

    // Get total count
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

    // Get articles with associations
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

    // Get filter options
    const categories = await CategoryArticle.findAll({
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });

    // Status counts
    const statusCounts = await Article.findAll({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["status"],
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
          statusCounts: statusCounts.reduce(
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
