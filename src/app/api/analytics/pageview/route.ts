import { NextRequest, NextResponse } from "next/server";
import { getModels } from "@/lib/models";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, page, title } = body;

    const models = await getModels();

    // Create page view
    await models.PageView.create({
      sessionId,
      page,
      title: title || null,
      viewedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Page view tracking error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
