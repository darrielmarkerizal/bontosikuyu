import { NextResponse } from "next/server";
import { getDatabase, testConnection } from "@/lib/database";

export async function GET() {
  try {
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

    // Get database info
    const sequelize = await getDatabase();
    const databaseInfo = {
      dialect: sequelize.getDialect(),
      database: sequelize.getDatabaseName(),
      host: sequelize.config.host,
      port: sequelize.config.port,
    };

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      timestamp: new Date().toISOString(),
      database: databaseInfo,
    });
  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Test query execution
    const sequelize = await getDatabase();
    const [results] = await sequelize.query("SELECT 1 + 1 AS result");

    return NextResponse.json({
      success: true,
      message: "Database query test successful",
      queryResult: results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database query test error:", error);
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
