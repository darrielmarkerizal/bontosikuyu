import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

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
}

interface SequelizeValidationError extends Error {
  name: "SequelizeValidationError";
  errors: Array<{
    path: string;
    message: string;
  }>;
}

// Add this interface after the existing interfaces
interface ArticleModel {
  id: number;
  title: string;
  status: string;
  createdAt: Date;
}

// GET - Get single writer by ID with performance metrics
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("🔍 Getting writer by ID with performance:", params.id);

    // Import sequelize and models directly
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const sequelize = require("../../../../../../config/database");

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

    // Import models
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Writer = require("../../../../../../models/writer.js")(
      sequelize,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("sequelize").DataTypes
    );

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Article = require("../../../../../../models/article.js")(
      sequelize,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("sequelize").DataTypes
    );

    const writerId = parseInt(params.id);

    if (isNaN(writerId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID penulis tidak valid",
        },
        { status: 400 }
      );
    }

    const writer = (await Writer.findByPk(writerId)) as WriterModel | null;

    if (!writer) {
      return NextResponse.json(
        {
          success: false,
          message: "Penulis tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // Get performance metrics
    const totalArticles = await Article.count({
      where: { writerId },
    });

    const publishedArticles = await Article.count({
      where: { writerId, status: "publish" },
    });

    const draftArticles = await Article.count({
      where: { writerId, status: "draft" },
    });

    // Get last article date
    const lastArticle = await Article.findOne({
      where: { writerId },
      order: [["createdAt", "DESC"]],
      attributes: ["createdAt"],
    });

    // Get articles count for current and last month
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const articlesThisMonth = await Article.count({
      where: {
        writerId,
        createdAt: {
          [Op.gte]: currentMonth,
        },
      },
    });

    const articlesLastMonth = await Article.count({
      where: {
        writerId,
        createdAt: {
          [Op.gte]: lastMonth,
          [Op.lt]: currentMonth,
        },
      },
    });

    // Calculate article growth
    const articleGrowth =
      articlesLastMonth > 0
        ? ((articlesThisMonth - articlesLastMonth) / articlesLastMonth) * 100
        : articlesThisMonth > 0
          ? 100
          : 0;

    // Get all articles (not just recent)
    const allArticles = await Article.findAll({
      where: { writerId },
      order: [["createdAt", "DESC"]],
      attributes: ["id", "title", "status", "createdAt"],
    });

    console.log(
      "✅ Writer with performance fetched successfully:",
      writer.fullName
    );

    return NextResponse.json({
      success: true,
      message: "Penulis berhasil diambil",
      data: {
        id: writer.id,
        fullName: writer.fullName,
        phoneNumber: writer.phoneNumber,
        dusun: writer.dusun,
        createdAt: writer.createdAt,
        updatedAt: writer.updatedAt,
        performance: {
          totalArticles,
          publishedArticles,
          draftArticles,
          totalViews: 0, // Not available in current schema
          averageViews: 0, // Not available in current schema
          lastArticleDate: lastArticle?.createdAt || null,
          articlesThisMonth,
          articlesLastMonth,
          viewGrowth: Math.round(articleGrowth), // Using article growth instead
        },
        recentArticles: allArticles.map((article: ArticleModel) => ({
          id: article.id,
          title: article.title,
          status: article.status,
          views: 0, // Not available in current schema
          createdAt: article.createdAt,
        })),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("💥 Error fetching writer:", error);
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

// PUT - Update writer by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("✏️ Updating writer:", params.id);

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
    const sequelize = require("../../../../../../config/database");

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
    const Writer = require("../../../../../../models/writer.js")(
      sequelize,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("sequelize").DataTypes
    );

    const writerId = parseInt(params.id);

    if (isNaN(writerId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID penulis tidak valid",
        },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { fullName, phoneNumber, dusun } = body;

    console.log("📝 Update data:", { fullName, phoneNumber, dusun });

    // Find existing writer
    const existingWriter = (await Writer.findByPk(
      writerId
    )) as WriterModel | null;

    if (!existingWriter) {
      return NextResponse.json(
        {
          success: false,
          message: "Penulis tidak ditemukan",
        },
        { status: 404 }
      );
    }

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

    // Check if phone number already exists (excluding current writer)
    const existingPhone = await Writer.findOne({
      where: {
        phoneNumber,
        id: { [Op.ne]: writerId },
      },
    });

    if (existingPhone) {
      return NextResponse.json(
        {
          success: false,
          message: "Nomor telepon sudah digunakan oleh penulis lain",
        },
        { status: 409 }
      );
    }

    // Update writer
    await Writer.update(
      {
        fullName,
        phoneNumber,
        dusun,
      },
      {
        where: { id: writerId },
      }
    );

    // Get updated writer
    const updatedWriter = (await Writer.findByPk(writerId)) as WriterModel;

    console.log("✅ Writer updated successfully:", updatedWriter.fullName);

    return NextResponse.json({
      success: true,
      message: "Penulis berhasil diperbarui",
      data: {
        id: updatedWriter.id,
        fullName: updatedWriter.fullName,
        phoneNumber: updatedWriter.phoneNumber,
        dusun: updatedWriter.dusun,
        createdAt: updatedWriter.createdAt,
        updatedAt: updatedWriter.updatedAt,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("💥 Error updating writer:", error);

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
        message: "Terjadi kesalahan saat memperbarui penulis",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete writer by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("🗑️ Deleting writer:", params.id);

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
    const sequelize = require("../../../../../../config/database");

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

    // Import Writer and Article models
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Writer = require("../../../../../../models/writer.js")(
      sequelize,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("sequelize").DataTypes
    );

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Article = require("../../../../../../models/article.js")(
      sequelize,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("sequelize").DataTypes
    );

    const writerId = parseInt(params.id);

    if (isNaN(writerId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID penulis tidak valid",
        },
        { status: 400 }
      );
    }

    // Find existing writer
    const existingWriter = (await Writer.findByPk(
      writerId
    )) as WriterModel | null;

    if (!existingWriter) {
      return NextResponse.json(
        {
          success: false,
          message: "Penulis tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // Check if writer has articles
    const articleCount = await Article.count({
      where: { writerId },
    });

    if (articleCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Tidak dapat menghapus penulis karena masih memiliki ${articleCount} artikel. Hapus atau pindahkan artikel terlebih dahulu.`,
        },
        { status: 409 }
      );
    }

    // Delete writer
    await Writer.destroy({
      where: { id: writerId },
    });

    console.log("✅ Writer deleted successfully:", existingWriter.fullName);

    return NextResponse.json({
      success: true,
      message: "Penulis berhasil dihapus",
      data: {
        id: existingWriter.id,
        fullName: existingWriter.fullName,
        phoneNumber: existingWriter.phoneNumber,
        dusun: existingWriter.dusun,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("💥 Error deleting writer:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat menghapus penulis",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
