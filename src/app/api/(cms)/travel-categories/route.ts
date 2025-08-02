import { NextResponse } from "next/server";
import { getModels } from "@/lib/models";

interface TravelCategory {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET() {
  try {
    const { TravelCategory } = await getModels();

    console.log("Fetching all travel categories");

    // Fetch all travel categories
    const categories = (await TravelCategory.findAll({
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    })) as TravelCategory[];

    console.log(
      "✅ Travel categories fetched successfully:",
      categories.length
    );

    return NextResponse.json({
      success: true,
      message: "Data kategori wisata berhasil diambil",
      data: {
        categories: categories.map((category) => ({
          id: category.id,
          name: category.name,
        })),
        total: categories.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("💥 Error fetching travel categories:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data kategori wisata",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
