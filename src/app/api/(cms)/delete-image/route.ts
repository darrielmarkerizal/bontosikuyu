import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function DELETE(request: NextRequest) {
  try {
    // Verify JWT token for authentication
    const token = getTokenFromRequest(request);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Token autentikasi diperlukan",
          error: "No authentication token provided",
        },
        { status: 401 }
      );
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Token autentikasi tidak valid",
          error: "Invalid or expired token",
        },
        { status: 401 }
      );
    }

    console.log(
      `✅ Authenticated user: ${decodedToken.username} (${decodedToken.fullName})`
    );

    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, message: "Image URL is required" },
        { status: 400 }
      );
    }

    const urlParts = imageUrl.split("/");
    const bucketName = urlParts[urlParts.length - 3]; // laiyolobaru-bucket
    const filePath = urlParts.slice(-2).join("/"); // articles/filename.jpg

    if (bucketName !== "laiyolobaru-bucket") {
      return NextResponse.json(
        { success: false, message: "Invalid bucket name" },
        { status: 400 }
      );
    }

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      console.error("Supabase delete error:", error);
      return NextResponse.json(
        { success: false, message: `Delete failed: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
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
