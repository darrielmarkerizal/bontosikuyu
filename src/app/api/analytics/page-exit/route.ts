import { NextRequest, NextResponse } from "next/server";
import { getModels } from "@/lib/models";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, page, timeOnPage } = body;

    const models = await getModels();

    // Find the last page view for this session and page
    const lastPageView = await models.PageView.findOne({
      where: {
        sessionId,
        page,
      },
      order: [["viewedAt", "DESC"]],
    });

    if (lastPageView) {
      await lastPageView.update({
        timeOnPage,
        exitPage: true,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Page exit tracking error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
