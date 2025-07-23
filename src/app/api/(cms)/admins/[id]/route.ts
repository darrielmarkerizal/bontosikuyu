import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";
import CryptoJS from "crypto-js";

interface UserModel {
  id: number;
  fullName: string;
  email: string;
  username: string;
  password: string;
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

// GET - Get single user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("🔍 Getting user by ID:", params.id);

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

    // Import User model
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const User = require("../../../../../../models/user.js")(
      sequelize,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("sequelize").DataTypes
    );

    const userId = parseInt(params.id);

    if (isNaN(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID admin tidak valid",
        },
        { status: 400 }
      );
    }

    const user = (await User.findByPk(userId, {
      attributes: [
        "id",
        "fullName",
        "email",
        "username",
        "createdAt",
        "updatedAt",
      ],
    })) as UserModel | null;

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin tidak ditemukan",
        },
        { status: 404 }
      );
    }

    console.log("✅ User found:", user.username);

    return NextResponse.json({
      success: true,
      message: "Admin berhasil diambil",
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("💥 Error fetching user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat mengambil data admin",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PUT - Update user by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("✏️ Updating user by ID:", params.id);

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

    // Import User model
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const User = require("../../../../../../models/user.js")(
      sequelize,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("sequelize").DataTypes
    );

    const userId = parseInt(params.id);

    if (isNaN(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID admin tidak valid",
        },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { fullName, email, username, password, currentPassword } = body;

    console.log("📝 Update data:", { fullName, email, username });

    // Find existing user
    const existingUser = (await User.findByPk(userId)) as UserModel | null;

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // Validation
    if (!fullName || !email || !username) {
      console.error("❌ Missing required fields");
      return NextResponse.json(
        {
          success: false,
          message: "Data tidak lengkap",
          errors: {
            fullName: !fullName ? "Nama lengkap wajib diisi" : undefined,
            email: !email ? "Email wajib diisi" : undefined,
            username: !username ? "Username wajib diisi" : undefined,
          },
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Format email tidak valid",
        },
        { status: 400 }
      );
    }

    // Validate username length
    if (username.length < 3 || username.length > 50) {
      return NextResponse.json(
        {
          success: false,
          message: "Username harus antara 3-50 karakter",
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

    // Check if email already exists (excluding current user)
    const existingEmail = await User.findOne({
      where: {
        email,
        id: { [Op.ne]: userId },
      },
    });

    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Email sudah digunakan oleh admin lain",
        },
        { status: 409 }
      );
    }

    // Check if username already exists (excluding current user)
    const existingUsername = await User.findOne({
      where: {
        username,
        id: { [Op.ne]: userId },
      },
    });

    if (existingUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username sudah digunakan oleh admin lain",
        },
        { status: 409 }
      );
    }

    // Prepare update data
    const updateData: Partial<UserModel> = {
      fullName,
      email,
      username,
    };

    // Handle password update if provided
    if (password) {
      // Validate password length
      if (password.length < 6) {
        return NextResponse.json(
          {
            success: false,
            message: "Password minimal 6 karakter",
          },
          { status: 400 }
        );
      }

      // If current password is provided, verify it
      if (currentPassword) {
        const hashedCurrentPassword =
          CryptoJS.SHA256(currentPassword).toString();
        if (existingUser.password !== hashedCurrentPassword) {
          return NextResponse.json(
            {
              success: false,
              message: "Password saat ini tidak valid",
            },
            { status: 400 }
          );
        }
      }

      // Hash new password
      updateData.password = CryptoJS.SHA256(password).toString();
    }

    // Update user
    await User.update(updateData, {
      where: { id: userId },
    });

    // Get updated user (without password)
    const updatedUser = (await User.findByPk(userId, {
      attributes: [
        "id",
        "fullName",
        "email",
        "username",
        "createdAt",
        "updatedAt",
      ],
    })) as UserModel;

    console.log("✅ User updated successfully:", updatedUser.username);

    return NextResponse.json({
      success: true,
      message: "Admin berhasil diperbarui",
      data: {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        username: updatedUser.username,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("💥 Error updating user:", error);

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
          message: "Email atau username sudah terdaftar",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat memperbarui admin",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete user by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("🗑️ Deleting user by ID:", params.id);

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

    // Import User and other models to check dependencies
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const User = require("../../../../../../models/user.js")(
      sequelize,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("sequelize").DataTypes
    );

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Log = require("../../../../../../models/log.js")(
      sequelize,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("sequelize").DataTypes
    );

    const userId = parseInt(params.id);

    if (isNaN(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID admin tidak valid",
        },
        { status: 400 }
      );
    }

    // Find existing user
    const existingUser = (await User.findByPk(userId, {
      attributes: [
        "id",
        "fullName",
        "email",
        "username",
        "createdAt",
        "updatedAt",
      ],
    })) as UserModel | null;

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // Check if user has logs (optional - you might want to keep logs for audit)
    const logCount = await Log.count({
      where: { userId },
    });

    // Get total user count to prevent deleting last admin
    const totalUsers = await User.count();

    if (totalUsers <= 1) {
      return NextResponse.json(
        {
          success: false,
          message: "Tidak dapat menghapus admin terakhir dalam sistem",
        },
        { status: 409 }
      );
    }

    // Delete user (logs will remain for audit trail)
    await User.destroy({
      where: { id: userId },
    });

    console.log("✅ User deleted successfully:", existingUser.username);

    return NextResponse.json({
      success: true,
      message: "Admin berhasil dihapus",
      data: {
        id: existingUser.id,
        fullName: existingUser.fullName,
        email: existingUser.email,
        username: existingUser.username,
        deletedLogs: logCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("💥 Error deleting user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat menghapus admin",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
