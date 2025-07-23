"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";

import { StatisticsHeader } from "@/components/statistic/statistics-header";
import { StatisticsFilters } from "@/components/statistic/statistics-filter";
import { StatisticsOverviewCards } from "@/components/statistic/statistics-overview";
import { StatisticsCharts } from "@/components/statistic/statistics-chart";
import { StatisticsTables } from "@/components/statistic/statistics-table";
import { StatisticsResponse } from "@/components/statistic/statistics-types";

export default function StatisticsPage() {
  const [statistics, setStatistics] = useState<StatisticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (timeRange !== "custom") {
        params.append("timeRange", timeRange);
      }

      if (timeRange === "custom" && dateRange?.from && dateRange?.to) {
        params.append("dateFrom", dateRange.from.toISOString());
        params.append("dateTo", dateRange.to.toISOString());
      }

      const response = await fetch(`/api/statistics?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: StatisticsResponse = await response.json();

      if (data.success) {
        setStatistics(data);
        toast.success("Statistik berhasil dimuat");
      } else {
        throw new Error(data.message || "Gagal memuat statistik");
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal memuat data statistik"
      );
    } finally {
      setLoading(false);
    }
  }, [timeRange, dateRange]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  const handleTimeRangeChange = (newTimeRange: string) => {
    setTimeRange(newTimeRange);
    if (newTimeRange !== "custom") {
      setDateRange(undefined);
    }
  };

  const handleRefresh = () => {
    fetchStatistics();
  };

  const handleExport = async () => {
    try {
      if (!statistics) {
        toast.error("Tidak ada data untuk diekspor");
        return;
      }

      // Create export data
      const exportData = {
        timestamp: statistics.timestamp,
        dateRange: statistics.data.dateRange,
        overview: statistics.data.overview,
        performance: statistics.data.performance,
        summary: {
          totalSessions: statistics.data.overview.totalSessions,
          totalPageViews: statistics.data.overview.totalPageViews,
          totalUniqueVisitors: statistics.data.overview.totalUniqueVisitors,
          avgSessionDuration: statistics.data.overview.avgSessionDuration,
          bounceRate: statistics.data.overview.bounceRate,
        },
        topPages: statistics.data.contentStats.topPages,
        topCountries: Object.entries(statistics.data.trafficStats.topCountries)
          .map(([country, count]) => ({ country, count }))
          .sort((a, b) => b.count - a.count),
        deviceBreakdown: statistics.data.deviceStats.deviceBreakdown,
        browserStats: Object.entries(statistics.data.browserStats)
          .map(([browser, count]) => ({ browser, count }))
          .sort((a, b) => b.count - a.count),
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `statistics-export-${new Date().toISOString().split("T")[0]}.json`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
      toast.success("Data statistik berhasil diekspor");
    } catch (error) {
      console.error("Error exporting statistics:", error);
      toast.error("Gagal mengekspor data statistik");
    }
  };

  if (loading && !statistics) {
    return (
      <div className="min-h-screen w-full">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-7xl">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/2 sm:w-1/3 mb-2"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 sm:w-2/3"></div>
          </div>

          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 sm:h-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>

          <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 sm:h-64 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="min-h-screen w-full">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-7xl">
          <StatisticsHeader />
          <div className="text-center py-8 sm:py-12">
            <p className="text-muted-foreground text-sm sm:text-base">
              Gagal memuat data statistik
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-7xl">
        {/* Header */}
        <StatisticsHeader performance={statistics.data.performance} />

        {/* Filters */}
        <StatisticsFilters
          timeRange={timeRange}
          dateRange={dateRange}
          onTimeRangeChange={handleTimeRangeChange}
          onDateRangeChange={setDateRange}
          onRefresh={handleRefresh}
          onExport={handleExport}
          loading={loading}
        />

        {/* Overview Cards */}
        <StatisticsOverviewCards
          overview={statistics.data.overview}
          realtimeStats={statistics.data.realtimeStats}
        />

        {/* Charts */}
        <StatisticsCharts
          activityStats={statistics.data.activityStats}
          deviceStats={statistics.data.deviceStats}
          trafficStats={statistics.data.trafficStats}
          browserStats={statistics.data.browserStats}
          weeklyPatterns={statistics.data.temporalPatterns.weeklyPatterns}
        />

        {/* Tables */}
        <StatisticsTables
          contentStats={statistics.data.contentStats}
          userStats={statistics.data.userStats}
          geographicStats={statistics.data.geographicStats}
          osStats={statistics.data.osStats}
        />
      </div>
    </div>
  );
}
