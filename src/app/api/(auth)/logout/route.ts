import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { createLog } from "@/lib/logger-auth";

export async function POST(request: NextRequest) {
  try {
    // Get user from token before clearing it
    const user = getUserFromRequest(request);

    // Log logout activity
    if (user) {
      await createLog(
        {
          action: "LOGOUT",
          userId: user.id,
          description: `User ${user.username} logged out`,
        },
        request
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Logout berhasil",
      timestamp: new Date().toISOString(),
    });

    // Clear the auth cookie
    response.cookies.set({
      name: "auth-token",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Expire immediately
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal melakukan logout",
        error:
          error instanceof Error ? error.message : "Kesalahan tidak diketahui",
      },
      { status: 500 }
    );
  }
}
