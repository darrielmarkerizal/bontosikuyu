import { NextRequest, NextResponse } from "next/server";
import sequelize from "../../../../../../config/database";
import defineUmkm from "../../../../../../models/umkm.js";
import defineCategoryUmkm from "../../../../../../models/categoryumkm.js";
import { DataTypes, Model } from "sequelize";

// Define interfaces for the models
interface UmkmModel extends Model {
  id: number;
  umkmName: string;
  ownerName: string;
  umkmCategoryId: number;
  dusun:
    | "Dusun Laiyolo"
    | "Dusun Pangkaje'ne"
    | "Dusun Timoro"
    | "Dusun Kilotepo";
  phone: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  category?: CategoryUmkmModel;
}

interface CategoryUmkmModel extends Model {
  id: number;
  name: string;
}

interface SequelizeValidationError extends Error {
  name: "SequelizeValidationError";
  errors: Array<{
    path: string;
    message: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    try {
      await sequelize.authenticate();
      console.log("Database connection has been established successfully.");
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Database connection failed",
          error: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }

    const Umkm = defineUmkm(sequelize, DataTypes);
    const CategoryUmkm = defineCategoryUmkm(sequelize, DataTypes);

    Umkm.belongsTo(CategoryUmkm, {
      foreignKey: "umkmCategoryId",
      as: "category",
    });

    const umkmId = parseInt(params.id);

    if (isNaN(umkmId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID UMKM tidak valid",
        },
        { status: 400 }
      );
    }

    const umkm = (await Umkm.findByPk(umkmId, {
      include: [
        {
          model: CategoryUmkm,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    })) as unknown as UmkmModel | null;

    if (!umkm) {
      return NextResponse.json(
        {
          success: false,
          message: "UMKM tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "UMKM berhasil diambil",
      data: {
        id: umkm.id,
        umkmName: umkm.umkmName,
        ownerName: umkm.ownerName,
        dusun: umkm.dusun,
        phone: umkm.phone,
        image: umkm.image,
        category: umkm.category,
        createdAt: umkm.createdAt,
        updatedAt: umkm.updatedAt,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching UMKM:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat mengambil UMKM",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    try {
      await sequelize.authenticate();
      console.log("Database connection has been established successfully.");
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Database connection failed",
          error: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }

    const Umkm = defineUmkm(sequelize, DataTypes);
    const CategoryUmkm = defineCategoryUmkm(sequelize, DataTypes);

    Umkm.belongsTo(CategoryUmkm, {
      foreignKey: "umkmCategoryId",
      as: "category",
    });

    const umkmId = parseInt(params.id);

    if (isNaN(umkmId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID UMKM tidak valid",
        },
        { status: 400 }
      );
    }

    // Check if UMKM exists
    const existingUmkm = (await Umkm.findByPk(
      umkmId
    )) as unknown as UmkmModel | null;

    if (!existingUmkm) {
      return NextResponse.json(
        {
          success: false,
          message: "UMKM tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { umkmName, ownerName, umkmCategoryId, dusun, phone, image } = body;

    // Validation
    if (!umkmName || !ownerName || !umkmCategoryId || !dusun || !phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Data tidak lengkap",
          errors: {
            umkmName: !umkmName ? "Nama UMKM wajib diisi" : undefined,
            ownerName: !ownerName ? "Nama pemilik wajib diisi" : undefined,
            umkmCategoryId: !umkmCategoryId
              ? "Kategori wajib dipilih"
              : undefined,
            dusun: !dusun ? "Dusun wajib dipilih" : undefined,
            phone: !phone ? "Nomor telepon wajib diisi" : undefined,
          },
        },
        { status: 400 }
      );
    }

    // Validate umkmName length
    if (umkmName.length < 2 || umkmName.length > 150) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama UMKM harus antara 2-150 karakter",
        },
        { status: 400 }
      );
    }

    // Validate ownerName length
    if (ownerName.length < 2 || ownerName.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama pemilik harus antara 2-100 karakter",
        },
        { status: 400 }
      );
    }

    // Validate dusun
    const validDusun = [
      "Dusun Laiyolo",
      "Dusun Pangkaje'ne",
      "Dusun Timoro",
      "Dusun Kilotepo",
    ];
    if (!validDusun.includes(dusun)) {
      return NextResponse.json(
        {
          success: false,
          message: "Dusun tidak valid",
        },
        { status: 400 }
      );
    }

    // Validate phone
    if (phone.length < 10 || phone.length > 20 || !/^\d+$/.test(phone)) {
      return NextResponse.json(
        {
          success: false,
          message: "Nomor telepon harus 10-20 digit angka",
        },
        { status: 400 }
      );
    }

    // Check if category exists
    const categoryExists = await CategoryUmkm.findByPk(umkmCategoryId);
    if (!categoryExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Kategori tidak ditemukan",
        },
        { status: 400 }
      );
    }

    // Update UMKM
    await existingUmkm.update({
      umkmName,
      ownerName,
      umkmCategoryId,
      dusun,
      phone,
      image: image || null,
    });

    // Fetch the updated UMKM with associations
    const updatedUmkm = (await Umkm.findByPk(umkmId, {
      include: [
        {
          model: CategoryUmkm,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    })) as unknown as UmkmModel;

    return NextResponse.json({
      success: true,
      message: "UMKM berhasil diperbarui",
      data: {
        id: updatedUmkm.id,
        umkmName: updatedUmkm.umkmName,
        ownerName: updatedUmkm.ownerName,
        dusun: updatedUmkm.dusun,
        phone: updatedUmkm.phone,
        image: updatedUmkm.image,
        category: updatedUmkm.category,
        createdAt: updatedUmkm.createdAt,
        updatedAt: updatedUmkm.updatedAt,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating UMKM:", error);

    // Handle Sequelize validation errors
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "SequelizeValidationError"
    ) {
      const validationErrors = (error as SequelizeValidationError).errors.map(
        (err) => ({
          field: err.path,
          message: err.message,
        })
      );

      return NextResponse.json(
        {
          success: false,
          message: "Validasi gagal",
          errors: validationErrors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat memperbarui UMKM",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    try {
      await sequelize.authenticate();
      console.log("Database connection has been established successfully.");
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Database connection failed",
          error: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }

    const Umkm = defineUmkm(sequelize, DataTypes);
    const CategoryUmkm = defineCategoryUmkm(sequelize, DataTypes);

    Umkm.belongsTo(CategoryUmkm, {
      foreignKey: "umkmCategoryId",
      as: "category",
    });

    const umkmId = parseInt(params.id);

    if (isNaN(umkmId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID UMKM tidak valid",
        },
        { status: 400 }
      );
    }

    // Check if UMKM exists
    const existingUmkm = (await Umkm.findByPk(umkmId, {
      include: [
        {
          model: CategoryUmkm,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    })) as unknown as UmkmModel | null;

    if (!existingUmkm) {
      return NextResponse.json(
        {
          success: false,
          message: "UMKM tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // Store UMKM data before deletion for response
    const deletedUmkmData = {
      id: existingUmkm.id,
      umkmName: existingUmkm.umkmName,
      ownerName: existingUmkm.ownerName,
      dusun: existingUmkm.dusun,
      phone: existingUmkm.phone,
      image: existingUmkm.image,
      category: existingUmkm.category,
      createdAt: existingUmkm.createdAt,
      updatedAt: existingUmkm.updatedAt,
    };

    // Delete UMKM
    await existingUmkm.destroy();

    return NextResponse.json({
      success: true,
      message: "UMKM berhasil dihapus",
      data: deletedUmkmData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error deleting UMKM:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat menghapus UMKM",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
