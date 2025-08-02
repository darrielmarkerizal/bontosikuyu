import { NextRequest, NextResponse } from "next/server";
import { getModels } from "@/lib/models";
import { Op } from "sequelize";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import sequelize from "../../../../../../config/database";
import { DataTypes } from "sequelize";

interface TravelWithCategory {
  id: number;
  name: string;
  dusun: string;
  image: string | null;
  travelCategoryId: number;
  category: {
    id: number;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface RelatedTravel {
  id: number;
  name: string;
  dusun: string;
  image: string | null;
  category: {
    id: number;
    name: string;
  };
}

interface TravelDetailApiResponse {
  success: boolean;
  message: string;
  data: {
    travel: TravelWithCategory;
    relatedTravels: RelatedTravel[];
  };
  timestamp: string;
}

// Add interface for update data
interface TravelUpdateData {
  name?: string;
  dusun?:
    | "Dusun Laiyolo"
    | "Dusun Pangkaje'ne"
    | "Dusun Timoro"
    | "Dusun Kilotepo";
  image?: string | null;
  travelCategoryId?: number;
}

// Add interface for existing travel from database
interface ExistingTravelData {
  id: number;
  name: string;
  dusun: string;
  image: string | null;
  travelCategoryId: number;
  createdAt: Date;
  updatedAt: Date;
  get: (field: string) => string | number | null;
  dataValues: {
    name: string;
    dusun: string;
    image: string | null;
    travelCategoryId: number;
  };
}

// Helper function to create log entry
async function createLog(
  action: "CREATE" | "UPDATE" | "DELETE",
  tableName: string,
  recordId: number,
  userId: number,
  oldValues?: Record<string, unknown>,
  newValues?: Record<string, unknown>,
  description?: string,
  request?: NextRequest
) {
  try {
    console.log(
      `📝 Attempting to create log: ${action} on ${tableName} (ID: ${recordId})`
    );

    const Log = require("../../../../../../models/log.js")(
      sequelize,
      DataTypes
    );

    const logData: Record<string, unknown> = {
      action,
      tableName,
      recordId,
      userId,
      description,
    };

    if (oldValues) {
      logData.oldValues = JSON.stringify(oldValues);
    }

    if (newValues) {
      logData.newValues = JSON.stringify(newValues);
    }

    if (request) {
      const forwarded = request.headers.get("x-forwarded-for");
      const realIp = request.headers.get("x-real-ip");
      logData.ipAddress = forwarded?.split(",")[0] || realIp || "unknown";
      logData.userAgent = request.headers.get("user-agent") || "unknown";
    }

    console.log(` Log data prepared:`, {
      action,
      tableName,
      recordId,
      userId,
      description,
      hasOldValues: !!oldValues,
      hasNewValues: !!newValues,
      hasRequest: !!request,
    });

    const createdLog = await Log.create(logData);
    console.log(
      `✅ Log created successfully: ${action} on ${tableName} (ID: ${recordId}, Log ID: ${createdLog.id})`
    );
  } catch (error) {
    console.error("❌ Error creating log:", error);
    console.error("❌ Log details:", {
      action,
      tableName,
      recordId,
      userId,
      description,
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    // Don't throw error - logging failure shouldn't break the main operation
  }
}

// GET /api/(cms)/travels/[id] - Get specific travel by ID with related travels
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<
  NextResponse<
    | TravelDetailApiResponse
    | { success: boolean; message: string; timestamp: string }
  >
> {
  try {
    const { Travel, TravelCategory } = await getModels();
    const travelId = parseInt(params.id);

    // Validate ID
    if (isNaN(travelId) || travelId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "ID travel tidak valid",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    console.log("🔍 Fetching travel detail for ID:", travelId);

    // Fetch the specific travel
    const travel = (await Travel.findByPk(travelId, {
      include: [
        {
          model: TravelCategory,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    })) as TravelWithCategory | null;

    if (!travel) {
      console.log("❌ Travel not found for ID:", travelId);
      return NextResponse.json(
        {
          success: false,
          message: "Travel tidak ditemukan",
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    console.log("✅ Travel found:", travel.name);

    // Fetch related travels from the same dusun (excluding current travel)
    const relatedTravelsData = (await Travel.findAll({
      where: {
        dusun: travel.dusun,
        id: {
          [Op.ne]: travelId, // Exclude current travel
        },
      },
      include: [
        {
          model: TravelCategory,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
      limit: 6, // Limit to 6 related travels
      order: [["createdAt", "DESC"]],
    })) as TravelWithCategory[];

    console.log("🔗 Found related travels:", relatedTravelsData.length);

    // Map related travels to proper format
    const relatedTravels: RelatedTravel[] = relatedTravelsData.map((item) => ({
      id: item.id,
      name: item.name,
      dusun: item.dusun,
      image: item.image,
      category: item.category,
    }));

    const response: TravelDetailApiResponse = {
      success: true,
      message: "Detail travel berhasil dimuat",
      data: {
        travel: {
          id: travel.id,
          name: travel.name,
          dusun: travel.dusun,
          image: travel.image,
          travelCategoryId: travel.travelCategoryId,
          createdAt: travel.createdAt,
          updatedAt: travel.updatedAt,
          category: travel.category,
        },
        relatedTravels,
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("💥 Error fetching travel detail:", error);

    return NextResponse.json(
      {
        success: false,
        message: `Gagal memuat detail travel: ${error instanceof Error ? error.message : "Unknown error"}`,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// PUT /api/(cms)/travels/[id] - Update specific travel
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
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

    const { Travel, TravelCategory } = await getModels();
    const travelId = parseInt(params.id);

    // Validate ID
    if (isNaN(travelId) || travelId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "ID travel tidak valid",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, dusun, image, travelCategoryId } = body;

    console.log("📝 Updating travel ID:", travelId, "with data:", body);

    // Validate required fields
    if (!name || !dusun || !travelCategoryId) {
      return NextResponse.json(
        {
          success: false,
          message: "Field name, dusun, dan travelCategoryId wajib diisi",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Check if travel exists and get old values for logging
    const existingTravel = await Travel.findByPk(travelId, {
      include: [
        {
          model: TravelCategory,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!existingTravel) {
      return NextResponse.json(
        {
          success: false,
          message: "Travel tidak ditemukan",
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // Get old values for logging
    const oldValues = {
      id: existingTravel.get("id"),
      name: existingTravel.get("name"),
      dusun: existingTravel.get("dusun"),
      image: existingTravel.get("image"),
      travelCategoryId: existingTravel.get("travelCategoryId"),
      category: existingTravel.get("category")
        ? (existingTravel.get("category") as { name: string }).name
        : null,
    };

    // Validate dusun enum
    const validDusuns = [
      "Dusun Laiyolo",
      "Dusun Pangkaje'ne",
      "Dusun Timoro",
      "Dusun Kilotepo",
    ];

    if (!validDusuns.includes(dusun)) {
      return NextResponse.json(
        {
          success: false,
          message: "Dusun tidak valid",
          validOptions: validDusuns,
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Validate category exists
    const category = await TravelCategory.findByPk(parseInt(travelCategoryId), {
      attributes: ["id", "name"], // Remove description field
    });
    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Kategori travel tidak ditemukan",
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // Check if travel name already exists in the same dusun (excluding current travel)
    const duplicateTravel = await Travel.findOne({
      where: {
        name: name.trim(),
        dusun: dusun,
        id: {
          [Op.ne]: travelId,
        },
      },
    });

    if (duplicateTravel) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama travel sudah ada di dusun yang sama",
          timestamp: new Date().toISOString(),
        },
        { status: 409 }
      );
    }

    // Validate image URL if provided
    if (image && image.trim()) {
      try {
        new URL(image.trim());
      } catch {
        return NextResponse.json(
          {
            success: false,
            message: "URL gambar tidak valid",
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
      }
    }

    // Update travel
    await Travel.update(
      {
        name: name.trim(),
        dusun: dusun,
        image: image?.trim() || null,
        travelCategoryId: parseInt(travelCategoryId),
      },
      {
        where: { id: travelId },
      }
    );

    // Fetch updated travel with category
    const updatedTravel = (await Travel.findByPk(travelId, {
      include: [
        {
          model: TravelCategory,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    })) as TravelWithCategory;

    // Get new values for logging
    const newValues = {
      id: updatedTravel.id,
      name: updatedTravel.name,
      dusun: updatedTravel.dusun,
      image: updatedTravel.image,
      travelCategoryId: updatedTravel.travelCategoryId,
      category: updatedTravel.category?.name,
    };

    // Create log entry for UPDATE action
    await createLog(
      "UPDATE",
      "travels",
      travelId,
      decodedToken.id,
      oldValues,
      newValues,
      `Destinasi wisata "${name}" berhasil diperbarui oleh ${decodedToken.fullName}`,
      request
    );

    console.log("✅ Travel updated successfully:", updatedTravel.name);

    return NextResponse.json({
      success: true,
      message: "Travel berhasil diperbarui",
      data: {
        travel: {
          id: updatedTravel.id,
          name: updatedTravel.name,
          dusun: updatedTravel.dusun,
          image: updatedTravel.image,
          travelCategoryId: updatedTravel.travelCategoryId,
          category: updatedTravel.category,
          createdAt: updatedTravel.createdAt,
          updatedAt: updatedTravel.updatedAt,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("💥 Error updating travel:", error);

    if (error instanceof Error) {
      // Handle Sequelize validation errors
      if (error.name === "SequelizeValidationError") {
        return NextResponse.json(
          {
            success: false,
            message: "Data tidak valid",
            error: error.message,
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui travel",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// DELETE /api/(cms)/travels/[id] - Delete specific travel
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
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

    const { Travel, TravelCategory } = await getModels();
    const travelId = parseInt(params.id);

    // Validate ID
    if (isNaN(travelId) || travelId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "ID travel tidak valid",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    console.log("🗑️ Deleting travel ID:", travelId);

    // Check if travel exists and get data for logging
    const existingTravel = (await Travel.findByPk(travelId, {
      include: [
        {
          model: TravelCategory,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    })) as TravelWithCategory | null;

    if (!existingTravel) {
      return NextResponse.json(
        {
          success: false,
          message: "Travel tidak ditemukan",
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // Get deleted travel data for logging
    const deletedTravelData = {
      id: existingTravel.id,
      name: existingTravel.name,
      dusun: existingTravel.dusun,
      image: existingTravel.image,
      travelCategoryId: existingTravel.travelCategoryId,
      category: existingTravel.category?.name,
    };

    // Store travel info before deletion for response
    const deletedTravelInfo = {
      id: existingTravel.id,
      name: existingTravel.name,
      dusun: existingTravel.dusun,
      category: existingTravel.category,
    };

    // Delete travel
    await Travel.destroy({
      where: { id: travelId },
    });

    // Create log entry for DELETE action
    await createLog(
      "DELETE",
      "travels",
      travelId,
      decodedToken.id,
      deletedTravelData, // Old values (the deleted data)
      undefined, // No new values for DELETE
      `Destinasi wisata "${existingTravel.name}" berhasil dihapus oleh ${decodedToken.fullName}`,
      request
    );

    console.log("✅ Travel deleted successfully:", deletedTravelInfo.name);

    return NextResponse.json({
      success: true,
      message: "Travel berhasil dihapus",
      data: {
        deletedTravel: deletedTravelInfo,
        deletedTravelId: travelId,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("💥 Error deleting travel:", error);

    // Handle foreign key constraint errors
    if (
      error instanceof Error &&
      error.name === "SequelizeForeignKeyConstraintError"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Travel tidak dapat dihapus karena masih memiliki relasi dengan data lain",
          timestamp: new Date().toISOString(),
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus travel",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// PATCH /api/(cms)/travels/[id] - Partial update (for specific fields only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
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

    const { Travel, TravelCategory } = await getModels();
    const travelId = parseInt(params.id);

    // Validate ID
    if (isNaN(travelId) || travelId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "ID travel tidak valid",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log("🔧 Partial update travel ID:", travelId, "with data:", body);

    // Check if travel exists - Fix: Use proper typing
    const existingTravel = (await Travel.findByPk(
      travelId
    )) as ExistingTravelData | null;
    if (!existingTravel) {
      return NextResponse.json(
        {
          success: false,
          message: "Travel tidak ditemukan",
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // Build update object with only provided fields
    const updateData: TravelUpdateData = {};

    if (body.name !== undefined) {
      if (!body.name || !body.name.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: "Nama travel tidak boleh kosong",
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
      }
      updateData.name = body.name.trim();
    }

    if (body.dusun !== undefined) {
      const validDusuns = [
        "Dusun Laiyolo",
        "Dusun Pangkaje'ne",
        "Dusun Timoro",
        "Dusun Kilotepo",
      ];

      if (!validDusuns.includes(body.dusun)) {
        return NextResponse.json(
          {
            success: false,
            message: "Dusun tidak valid",
            validOptions: validDusuns,
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
      }
      updateData.dusun = body.dusun;
    }

    if (body.image !== undefined) {
      if (body.image && body.image.trim()) {
        try {
          new URL(body.image.trim());
          updateData.image = body.image.trim();
        } catch {
          return NextResponse.json(
            {
              success: false,
              message: "URL gambar tidak valid",
              timestamp: new Date().toISOString(),
            },
            { status: 400 }
          );
        }
      } else {
        updateData.image = null;
      }
    }

    if (body.travelCategoryId !== undefined) {
      const categoryId = parseInt(body.travelCategoryId);
      if (isNaN(categoryId)) {
        return NextResponse.json(
          {
            success: false,
            message: "ID kategori tidak valid",
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
      }

      // Validate category exists
      const category = await TravelCategory.findByPk(categoryId, {
        attributes: ["id", "name"], // Remove description field
      });
      if (!category) {
        return NextResponse.json(
          {
            success: false,
            message: "Kategori travel tidak ditemukan",
            timestamp: new Date().toISOString(),
          },
          { status: 404 }
        );
      }
      updateData.travelCategoryId = categoryId;
    }

    // Check for name duplication if name or dusun is being updated - Fix: Use dataValues instead of get()
    if (updateData.name || updateData.dusun) {
      const checkName = updateData.name || existingTravel.dataValues.name;
      const checkDusun = updateData.dusun || existingTravel.dataValues.dusun;

      const duplicateTravel = await Travel.findOne({
        where: {
          name: checkName,
          dusun: checkDusun,
          id: {
            [Op.ne]: travelId,
          },
        },
      });

      if (duplicateTravel) {
        return NextResponse.json(
          {
            success: false,
            message: "Nama travel sudah ada di dusun yang sama",
            timestamp: new Date().toISOString(),
          },
          { status: 409 }
        );
      }
    }

    // If no fields to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Tidak ada data yang diperbarui",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Filter out null values and update travel
    const filteredUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([value]) => value !== null)
    );

    await Travel.update(filteredUpdateData, {
      where: { id: travelId },
    });

    // Fetch updated travel with category
    const updatedTravel = (await Travel.findByPk(travelId, {
      include: [
        {
          model: TravelCategory,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    })) as TravelWithCategory;

    console.log(
      "✅ Travel partially updated successfully:",
      updatedTravel.name
    );

    return NextResponse.json({
      success: true,
      message: "Travel berhasil diperbarui",
      data: {
        travel: {
          id: updatedTravel.id,
          name: updatedTravel.name,
          dusun: updatedTravel.dusun,
          image: updatedTravel.image,
          travelCategoryId: updatedTravel.travelCategoryId,
          category: updatedTravel.category,
          createdAt: updatedTravel.createdAt,
          updatedAt: updatedTravel.updatedAt,
        },
        updatedFields: Object.keys(updateData),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("💥 Error partially updating travel:", error);

    if (error instanceof Error) {
      // Handle Sequelize validation errors
      if (error.name === "SequelizeValidationError") {
        return NextResponse.json(
          {
            success: false,
            message: "Data tidak valid",
            error: error.message,
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui travel",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
