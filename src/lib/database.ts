import { Sequelize } from "sequelize";

let sequelize: Sequelize | null = null;

export async function getDatabase() {
  if (!sequelize) {
    // Dynamic import mysql2 to avoid webpack bundling issues
    const mysql2 = await import("mysql2");

    sequelize = new Sequelize({
      dialect: "mysql",
      dialectModule: mysql2,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "3306"),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      logging: process.env.NODE_ENV === "development" ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });
  }
  return sequelize;
}

// Test connection function
export async function testConnection() {
  try {
    const db = await getDatabase();
    await db.authenticate();
    console.log("Database connection has been established successfully.");
    return { success: true, message: "Database connected successfully" };
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
