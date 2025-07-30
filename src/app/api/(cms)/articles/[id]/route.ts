import { NextRequest, NextResponse } from "next/server";
import sequelize from "../../../../../../config/database";
import defineArticle from "../../../../../../models/article.js";
import defineCategoryArticle from "../../../../../../models/categoryarticle.js";
import defineWriter from "../../../../../../models/writer.js";
import { DataTypes, Model } from "sequelize";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Database connection and model setup
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

    // Check if article exists
    const existingArticle = await Article.findByPk(articleId);
    if (!existingArticle) {
      return NextResponse.json(
        {
          success: false,
          message: "Artikel tidak ditemukan",
        },
        { status: 404 }
      );
    }

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

    // Update article
    await existingArticle.update({
      title,
      content,
      status: status || "draft",
      imageUrl: imageUrl || null,
      articleCategoryId,
      writerId,
    });

    // Fetch the updated article with associations
    const updatedArticle = await Article.findByPk(articleId, {
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

    if (!updatedArticle) {
      return NextResponse.json(
        {
          success: false,
          message: "Gagal mengambil artikel yang diperbarui",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Artikel berhasil diperbarui",
        data: {
          id: updatedArticle.get("id"),
          title: updatedArticle.get("title"),
          content: updatedArticle.get("content"),
          status: updatedArticle.get("status"),
          imageUrl: updatedArticle.get("imageUrl"),
          category: updatedArticle.get("category"),
          writer: updatedArticle.get("writer"),
          createdAt: updatedArticle.get("createdAt"),
          updatedAt: updatedArticle.get("updatedAt"),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat memperbarui artikel",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Database connection and model setup
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

    // Check if article exists
    const existingArticle = await Article.findByPk(articleId);
    if (!existingArticle) {
      return NextResponse.json(
        {
          success: false,
          message: "Artikel tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // Delete article
    await existingArticle.destroy();

    return NextResponse.json(
      {
        success: true,
        message: "Artikel berhasil dihapus",
        data: {
          id: articleId,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat menghapus artikel",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
