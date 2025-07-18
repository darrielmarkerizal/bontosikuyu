import { NextRequest, NextResponse } from "next/server";
import { getModels } from "@/lib/models";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import { createLog } from "@/lib/logger-auth";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";
const JWT_EXPIRES_IN = "1d";

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated - more explicit check
    const token = getTokenFromRequest(request);
    console.log("Token found:", token ? "YES" : "NO");

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Token autentikasi diperlukan untuk mendaftarkan pengguna",
          error: "No token provided",
        },
        { status: 401 }
      );
    }

    const authenticatedUser = verifyToken(token);
    console.log("User authenticated:", authenticatedUser ? "YES" : "NO");

    if (!authenticatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Token autentikasi tidak valid atau sudah kadaluarsa",
          error: "Invalid token",
        },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();

    // Validate required fields
    const { fullName, email, username, password, confirmPassword } = body;

    if (!fullName || !email || !username || !password || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Semua field wajib diisi",
          required: [
            "fullName",
            "email",
            "username",
            "password",
            "confirmPassword",
          ],
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

    // Validate password confirmation
    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Konfirmasi password tidak cocok",
        },
        { status: 400 }
      );
    }

    // Validate username length
    if (username.length < 3) {
      return NextResponse.json(
        {
          success: false,
          message: "Username minimal 3 karakter",
        },
        { status: 400 }
      );
    }

    // Get models
    const { User } = await getModels();

    // Check if email already exists
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Email sudah terdaftar",
        },
        { status: 409 }
      );
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username sudah digunakan",
        },
        { status: 409 }
      );
    }

    // Hash password using crypto-js
    const hashedPassword = CryptoJS.SHA256(password).toString();

    // Create new user
    const newUser = await User.create({
      fullName,
      email,
      username,
      password: hashedPassword,
    });

    // Generate JWT token for the new user
    const tokenPayload = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      fullName: newUser.fullName,
    };

    const newToken = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: "laiyolobaru-app",
      audience: "laiyolobaru-users",
    } as jwt.SignOptions);

    // Log registration
    await createLog(
      {
        action: "CREATE",
        tableName: "Users",
        recordId: newUser.id,
        userId: authenticatedUser.id, // Who registered this user
        description: `User ${authenticatedUser.username} mendaftarkan pengguna baru: ${newUser.username} (${newUser.email})`,
        newValues: {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          username: newUser.username,
          createdAt: newUser.createdAt,
          registeredBy: authenticatedUser.username,
        },
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: "Pengguna berhasil didaftarkan",
      data: {
        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          username: newUser.username,
        },
        token: newToken,
        expiresIn: JWT_EXPIRES_IN,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("User creation error:", error);

    // Handle JWT errors
    if (
      error instanceof Error &&
      (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError")
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Token autentikasi tidak valid atau sudah kadaluarsa",
        },
        { status: 401 }
      );
    }

    // Handle validation errors
    if (error instanceof Error && error.name === "SequelizeValidationError") {
      return NextResponse.json(
        {
          success: false,
          message: "Terjadi kesalahan validasi data",
          error: error.message,
        },
        { status: 400 }
      );
    }

    // Handle unique constraint errors
    if (
      error instanceof Error &&
      error.name === "SequelizeUniqueConstraintError"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Email atau username sudah terdaftar",
          error: error.message,
        },
        { status: 409 }
      );
    }

    // Handle database connection errors
    if (error instanceof Error && error.message.includes("connect")) {
      return NextResponse.json(
        {
          success: false,
          message: "Gagal terhubung ke database",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mendaftarkan pengguna",
        error:
          error instanceof Error ? error.message : "Kesalahan tidak diketahui",
      },
      { status: 500 }
    );
  }
}
