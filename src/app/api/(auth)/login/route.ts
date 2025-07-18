import { NextRequest, NextResponse } from "next/server";
import { getModels } from "@/lib/models";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { createLog } from "@/lib/logger-auth";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";
const JWT_EXPIRES_IN = "1d";

export async function POST(request: NextRequest) {
  try {
    // Get request body
    const body = await request.json();

    // Validate required fields
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email/username dan password wajib diisi",
          required: ["identifier", "password"],
        },
        { status: 400 }
      );
    }

    // Get models
    const { User } = await getModels();

    // Find user by email or username using Sequelize Op.or
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Email/username atau password tidak valid",
        },
        { status: 401 }
      );
    }

    // Hash the provided password and compare
    const hashedPassword = CryptoJS.SHA256(password).toString();

    if (user.password !== hashedPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Email/username atau password tidak valid",
        },
        { status: 401 }
      );
    }

    // Generate JWT token
    const tokenPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: "laiyolobaru-app",
      audience: "laiyolobaru-users",
    } as jwt.SignOptions);

    // Log successful login
    await createLog(
      {
        action: "LOGIN",
        userId: user.id,
        description: `User ${user.username} berhasil login`,
      },
      request
    );

    // Set HTTP-only cookie for security
    const response = NextResponse.json({
      success: true,
      message: "Login berhasil",
      data: {
        token,
        expiresIn: JWT_EXPIRES_IN,
      },
      timestamp: new Date().toISOString(),
    });

    // Set secure cookie
    response.cookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day in seconds
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

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

    // Handle JWT errors
    if (error instanceof Error && error.name === "JsonWebTokenError") {
      return NextResponse.json(
        {
          success: false,
          message: "Gagal membuat token autentikasi",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Gagal melakukan login",
        error:
          error instanceof Error ? error.message : "Kesalahan tidak diketahui",
      },
      { status: 500 }
    );
  }
}
