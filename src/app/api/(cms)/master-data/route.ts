import { NextRequest, NextResponse } from "next/server";

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

    // Fetch categories
    const categories = await CategoryArticle.findAll({
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });

    // Fetch writers
    const writers = await Writer.findAll({
      attributes: ["id", "fullName", "dusun"],
      order: [["fullName", "ASC"]],
    });

    return NextResponse.json({
      success: true,
      message: "Master data berhasil diambil",
      data: {
        categories: categories.map((category: any) => ({
          id: category.id,
          name: category.name,
        })),
        writers: writers.map((writer: any) => ({
          id: writer.id,
          fullName: writer.fullName,
          dusun: writer.dusun,
        })),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching master data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat mengambil master data",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
