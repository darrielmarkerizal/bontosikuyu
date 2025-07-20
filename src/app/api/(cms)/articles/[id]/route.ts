import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Import sequelize and models directly
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const sequelize = require("../../../../../../config/database");

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
    const Article = require("../../../../../../models/article.js")(
      sequelize,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("sequelize").DataTypes
    );
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const CategoryArticle =
      require("../../../../../../models/categoryarticle.js")(
        sequelize,
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require("sequelize").DataTypes
      );
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Writer = require("../../../../../../models/writer.js")(
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

    const articleId = parseInt(params.id);

    if (isNaN(articleId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID artikel tidak valid",
        },
        { status: 400 }
      );
    }

    // Fetch article with associations
    const article = await Article.findByPk(articleId, {
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

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          message: "Artikel tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Artikel berhasil diambil",
      data: {
        id: article.id,
        title: article.title,
        content: article.content,
        status: article.status,
        imageUrl: article.imageUrl,
        category: article.category,
        writer: article.writer,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat mengambil artikel",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
