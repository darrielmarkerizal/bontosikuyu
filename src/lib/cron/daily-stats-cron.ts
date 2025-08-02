import { DailyStatsService } from "../daily-stats-service";

/**
 * Cron job to generate daily stats
 * This should be called once per day (e.g., at 1 AM)
 */
export async function generateDailyStatsCron() {
  try {
    console.log("🕐 Starting daily stats generation cron job");

    // Generate stats for yesterday (since today is not complete)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    await DailyStatsService.generateDailyStats(yesterdayStr);

    console.log("✅ Daily stats cron job completed successfully");
  } catch (error) {
    console.error("❌ Daily stats cron job failed:", error);
  }
}

/**
 * Generate stats for missing dates
 */
export async function generateMissingStats(startDate: string, endDate: string) {
  try {
    console.log(`�� Generating missing stats from ${startDate} to ${endDate}`);

    await DailyStatsService.generateDateRangeStats(startDate, endDate);

    console.log("✅ Missing stats generation completed");
  } catch (error) {
    console.error("❌ Missing stats generation failed:", error);
  }
}
