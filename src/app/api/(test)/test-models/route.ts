import { NextRequest, NextResponse } from "next/server";
import { getModels } from "@/lib/models";
import { testConnection } from "@/lib/database";

export async function GET() {
  try {
    // First test database connection
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

    // Initialize models
    const { User, Article } = await getModels();

    // Test User model - Get all users
    const users = await User.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
    });

    // Test Article model - Get all articles with basic info
    const articles = await Article.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      attributes: ["id", "status", "content", "createdAt"],
    });

    // Get counts
    const userCount = await User.count();
    const articleCount = await Article.count();

    return NextResponse.json({
      success: true,
      message: "Models test successful",
      data: {
        users: {
          count: userCount,
          data: users,
        },
        articles: {
          count: articleCount,
          data: articles.map((article) => ({
            id: article.id,
            status: article.status,
            contentPreview: article.content.substring(0, 100) + "...",
            createdAt: article.createdAt,
          })),
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Models test error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Models test failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { User } = await getModels();

    // Test creating a new user
    const userData = {
      fullName: body.fullName || "Test User",
      email: body.email || `test${Date.now()}@example.com`,
      username: body.username || `testuser${Date.now()}`,
      password: body.password || "testpassword123",
    };

    const newUser = await User.create(userData);

    return NextResponse.json({
      success: true,
      message: "User created successfully",
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
    console.error("User creation test error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "User creation failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { User } = await getModels();

    if (!body.id) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required for update",
        },
        { status: 400 }
      );
    }

    const user = await User.findByPk(body.id);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (body.fullName) updateData.fullName = body.fullName;
    if (body.email) updateData.email = body.email;
    if (body.username) updateData.username = body.username;

    await user.update(updateData);

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        updatedAt: user.updatedAt,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("User update test error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "User update failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required for deletion",
        },
        { status: 400 }
      );
    }

    const { User } = await getModels();
    const user = await User.findByPk(userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    await user.destroy();

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
      data: {
        deletedUserId: userId,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("User deletion test error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "User deletion failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
