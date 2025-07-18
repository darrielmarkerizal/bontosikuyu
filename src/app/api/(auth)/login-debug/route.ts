import { NextRequest, NextResponse } from "next/server";
import { getModels } from "@/lib/models";
import CryptoJS from "crypto-js";
import { Op } from "sequelize";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    console.log("=== LOGIN DEBUG ===");
    console.log("Input identifier:", identifier);
    console.log("Input password:", password);

    if (!identifier || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email/username dan password wajib diisi",
        },
        { status: 400 }
      );
    }

    const { User } = await getModels();

    // Find user with debug
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { username: identifier }],
      },
    });

    console.log("User found:", user ? "YES" : "NO");
    if (user) {
      console.log("User data:", {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
      });
      console.log("Stored password hash:", user.password);
    }

    if (!user) {
      // Check if any users exist at all
      const totalUsers = await User.count();
      console.log("Total users in database:", totalUsers);

      return NextResponse.json(
        {
          success: false,
          message: "User tidak ditemukan",
          debug: {
            totalUsers,
            searchedIdentifier: identifier,
          },
        },
        { status: 401 }
      );
    }

    // Hash the provided password and compare
    const hashedPassword = CryptoJS.SHA256(password).toString();
    console.log("Input password hash:", hashedPassword);
    console.log("Stored password hash:", user.password);
    console.log("Passwords match:", hashedPassword === user.password);

    if (user.password !== hashedPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Password tidak cocok",
          debug: {
            inputHash: hashedPassword,
            storedHash: user.password,
            match: false,
          },
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Login berhasil (debug mode)",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error("Login debug error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error dalam login debug",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
