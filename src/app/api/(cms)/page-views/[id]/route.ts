import { NextRequest, NextResponse } from "next/server";

// Define proper interfaces for Sequelize models
interface PageViewModel {
  id: number;
  sessionId: string;
  userId?: number;
  page: string;
  title?: string;
  timeOnPage?: number;
  exitPage: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: UserModel;
}

interface UserModel {
  id: number;
  fullName: string;
  email: string;
  username: string;
}

// Define interface for update data
interface PageViewUpdateData {
  timeOnPage?: number;
  exitPage?: boolean;
  title?: string;
}

// Helper function to load models and database
async function loadModels() {
  /* eslint-disable @typescript-eslint/no-require-imports */
  const sequelize = require("../../../../../../config/database");
  const { DataTypes } = require("sequelize");

  const PageView = require("../../../../../../models/pageview.js")(
    sequelize,
    DataTypes
  );
  const User = require("../../../../../../models/user.js")(
    sequelize,
    DataTypes
  );
  /* eslint-enable @typescript-eslint/no-require-imports */

  return { sequelize, PageView, User };
}

// GET - Get single page view by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("🔍 Getting single page view data");

    // Load models and database connection
    const { sequelize, PageView, User } = await loadModels();

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

    // Set up associations
    PageView.belongsTo(User, {
      foreignKey: "userId",
      as: "user",
    });

    const pageViewId = parseInt(params.id);

    if (isNaN(pageViewId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID page view tidak valid",
        },
        { status: 400 }
      );
    }

    const pageView = (await PageView.findByPk(pageViewId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "email", "username"],
          required: false,
        },
      ],
    })) as PageViewModel | null;

    if (!pageView) {
      return NextResponse.json(
        {
          success: false,
          message: "Page view tidak ditemukan",
        },
        { status: 404 }
      );
    }

    console.log("✅ Page view found:", pageView.id);

    return NextResponse.json({
      success: true,
      message: "Page view berhasil diambil",
      data: {
        id: pageView.id,
        sessionId: pageView.sessionId,
        userId: pageView.userId,
        page: pageView.page,
        title: pageView.title,
        timeOnPage: pageView.timeOnPage,
        exitPage: pageView.exitPage,
        user: pageView.user,
        createdAt: pageView.createdAt,
        updatedAt: pageView.updatedAt,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("💥 Error fetching page view:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat mengambil data page view",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PUT - Update page view by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("📝 Updating page view data");

    // Load models and database connection
    const { sequelize, PageView, User } = await loadModels();

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

    // Set up associations
    PageView.belongsTo(User, {
      foreignKey: "userId",
      as: "user",
    });

    const pageViewId = parseInt(params.id);

    if (isNaN(pageViewId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID page view tidak valid",
        },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { timeOnPage, exitPage, title } = body;

    console.log("📝 Update data:", { timeOnPage, exitPage, title });

    // Find existing page view
    const existingPageView = (await PageView.findByPk(
      pageViewId
    )) as PageViewModel | null;

    if (!existingPageView) {
      return NextResponse.json(
        {
          success: false,
          message: "Page view tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // Prepare update data with proper typing
    const updateData: PageViewUpdateData = {};

    if (timeOnPage !== undefined) {
      if (timeOnPage < 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Time on page tidak boleh negatif",
          },
          { status: 400 }
        );
      }
      updateData.timeOnPage = timeOnPage;
    }

    if (exitPage !== undefined) {
      updateData.exitPage = exitPage;
    }

    if (title !== undefined) {
      updateData.title = title;
    }

    // Update page view
    await PageView.update(updateData, {
      where: { id: pageViewId },
    });

    // Get updated page view with associations
    const updatedPageView = (await PageView.findByPk(pageViewId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "email", "username"],
          required: false,
        },
      ],
    })) as PageViewModel;

    console.log("✅ Page view updated successfully:", updatedPageView.id);

    return NextResponse.json({
      success: true,
      message: "Page view berhasil diperbarui",
      data: {
        id: updatedPageView.id,
        sessionId: updatedPageView.sessionId,
        userId: updatedPageView.userId,
        page: updatedPageView.page,
        title: updatedPageView.title,
        timeOnPage: updatedPageView.timeOnPage,
        exitPage: updatedPageView.exitPage,
        user: updatedPageView.user,
        createdAt: updatedPageView.createdAt,
        updatedAt: updatedPageView.updatedAt,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("💥 Error updating page view:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat memperbarui page view",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete page view by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("🗑️ Deleting page view data");

    // Load models and database connection
    const { sequelize, PageView } = await loadModels();

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

    const pageViewId = parseInt(params.id);

    if (isNaN(pageViewId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID page view tidak valid",
        },
        { status: 400 }
      );
    }

    // Find existing page view
    const existingPageView = (await PageView.findByPk(pageViewId, {
      attributes: [
        "id",
        "sessionId",
        "userId",
        "page",
        "title",
        "timeOnPage",
        "exitPage",
        "createdAt",
        "updatedAt",
      ],
    })) as PageViewModel | null;

    if (!existingPageView) {
      return NextResponse.json(
        {
          success: false,
          message: "Page view tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // Delete page view
    await PageView.destroy({
      where: { id: pageViewId },
    });

    console.log("✅ Page view deleted successfully:", existingPageView.id);

    return NextResponse.json({
      success: true,
      message: "Page view berhasil dihapus",
      data: {
        id: existingPageView.id,
        sessionId: existingPageView.sessionId,
        userId: existingPageView.userId,
        page: existingPageView.page,
        title: existingPageView.title,
        timeOnPage: existingPageView.timeOnPage,
        exitPage: existingPageView.exitPage,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("💥 Error deleting page view:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat menghapus page view",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
