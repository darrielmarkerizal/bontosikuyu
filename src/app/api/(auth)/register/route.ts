import { NextRequest, NextResponse } from "next/server";
import { getModels } from "@/lib/models";
import CryptoJS from "crypto-js";

export async function POST(request: NextRequest) {
  try {
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

    return NextResponse.json({
      success: true,
      message: "Pengguna berhasil didaftarkan",
      data: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        username: newUser.username,
        createdAt: newUser.createdAt,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("User creation error:", error);

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
