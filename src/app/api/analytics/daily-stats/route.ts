import { NextRequest, NextResponse } from "next/server";
import { DailyStatsService } from "@/lib/daily-stats-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const action = searchParams.get("action");

    if (action === "generate") {
      // Generate stats for today
      const result = await DailyStatsService.generateTodayStats();
      return NextResponse.json(result);
    }

    if (action === "generate-range" && startDate && endDate) {
      // Generate stats for date range
      const results = await DailyStatsService.generateDateRangeStats(
        startDate,
        endDate
      );
      return NextResponse.json({
        success: true,
        data: results,
      });
    }

    // Get existing stats
    if (startDate && endDate) {
      const result = await DailyStatsService.getDailyStats(startDate, endDate);
      return NextResponse.json(result);
    }

    // Get summary stats
    if (startDate && endDate) {
      const result = await DailyStatsService.getSummaryStats(
        startDate,
        endDate
      );
      return NextResponse.json(result);
    }

    return NextResponse.json(
      {
        success: false,
        message: "Missing required parameters",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("❌ Daily stats API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process daily stats",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
