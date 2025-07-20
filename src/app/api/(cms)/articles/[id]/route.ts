import { NextRequest, NextResponse } from "next/server";
import sequelize from "../../../../../../config/database";
import defineArticle from "../../../../../../models/article.js";
import defineCategoryArticle from "../../../../../../models/categoryarticle.js";
import defineWriter from "../../../../../../models/writer.js";
import { DataTypes, Model } from "sequelize";

// Define interfaces for the models
interface ArticleModel extends Model {
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
}

interface CategoryModel extends Model {
  id: number;
  name: string;
}

interface WriterModel extends Model {
  id: number;
  fullName: string;
  dusun: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    const Article = defineArticle(sequelize, DataTypes);
    const CategoryArticle = defineCategoryArticle(sequelize, DataTypes);
    const Writer = defineWriter(sequelize, DataTypes);

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

    const article = (await Article.findByPk(articleId, {
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
    })) as unknown as ArticleModel | null;

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
