import { NextResponse } from "next/server";
import { testConnection } from "@/lib/database";
import { getModels } from "@/lib/models";

export async function GET() {
  try {
    // Test database connection first
    const connectionTest = await testConnection();
    if (!connectionTest.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Database connection failed",
          error: connectionTest.error,
        },
        { status: 500 }
      );
    }

    // Get models
    const { User } = await getModels();

    // Get users using Sequelize model
    const users = await User.findAll({
      attributes: [
        "id",
        "fullName",
        "email",
        "username",
        "createdAt",
        "updatedAt",
      ],
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    // Get user count
    const total = await User.count();

    return NextResponse.json({
      success: true,
      message: "Users retrieved successfully",
      data: {
        users,
        total,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Users test error:", error);

    // Check if it's a table doesn't exist error
    if (error instanceof Error && error.message.includes("doesn't exist")) {
      return NextResponse.json(
        {
          success: false,
          message: "Users table doesn't exist. Please run migrations first.",
          error: error.message,
          suggestion: "Run: npx sequelize-cli db:migrate",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Database query failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
