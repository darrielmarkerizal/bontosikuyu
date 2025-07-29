import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { createLog } from "@/lib/logger-auth";

export async function POST(request: NextRequest) {
  try {
    console.log("🚪 Logout request received");

    // Get token from request (either Authorization header or cookie)
    const token = getTokenFromRequest(request);

    let user = null;

    if (token) {
      // Verify token and get user info
      user = verifyToken(token);

      if (user) {
        console.log(`✅ User authenticated for logout: ${user.username}`);

        // Log logout activity
        await createLog(
          {
            action: "LOGOUT",
            userId: user.id,
            description: `User ${user.username} logged out successfully`,
          },
          request
        );

        console.log("📝 Logout activity logged");
      } else {
        console.warn("⚠️ Invalid token provided for logout");
      }
    } else {
      console.warn("⚠️ No token found in logout request");
    }

    const response = NextResponse.json({
      success: true,
      message: "Logout berhasil",
      timestamp: new Date().toISOString(),
    });

    // Clear the auth cookie (if it exists)
    response.cookies.set({
      name: "auth-token",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Expire immediately
    });

    // Also clear the token cookie (used by frontend)
    response.cookies.set({
      name: "token",
      value: "",
      httpOnly: false, // Allow JavaScript access
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Expire immediately
    });

    console.log("✅ Logout response prepared");
    return response;
  } catch (error) {
    console.error("💥 Logout error:", error);

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
