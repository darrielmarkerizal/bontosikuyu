"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  MousePointer,
  Clock,
  Activity,
  Target,
} from "lucide-react";
import { StatisticsOverview, RealtimeStats } from "./statistics-types";

interface StatisticsOverviewProps {
  overview: StatisticsOverview;
  realtimeStats: RealtimeStats;
}

export function StatisticsOverviewCards({
  overview,
  realtimeStats,
}: StatisticsOverviewProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  const getGrowthBadge = (growth: number, label: string) => {
    const isPositive = growth > 0;
    const isNeutral = growth === 0;

    return (
      <div className="flex items-center gap-1 text-xs">
        {isNeutral ? (
          <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
            <Activity className="h-3 w-3 mr-1" />
            <span className="hidden xs:inline">{label}</span>
          </Badge>
        ) : (
          <Badge
            variant={isPositive ? "default" : "destructive"}
            className="text-xs px-1.5 py-0.5"
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            <span className="hidden xs:inline">{Math.abs(growth).toFixed(1)}%</span>
            <span className="xs:hidden">{Math.abs(growth).toFixed(0)}%</span>
            <span className="hidden sm:inline ml-1">{label}</span>
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Sessions */}
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium truncate">Total Sesi</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-xl sm:text-2xl font-bold">
            {formatNumber(overview.totalSessions)}
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground truncate">
              Hari ini: {formatNumber(realtimeStats.todaySessions)}
            </p>
            <div className="flex justify-start">
              {getGrowthBadge(realtimeStats.last24hGrowth.sessions, "24j")}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Page Views */}
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium truncate">
            Tayangan Halaman
          </CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-xl sm:text-2xl font-bold">
            {formatNumber(overview.totalPageViews)}
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground truncate">
              Hari ini: {formatNumber(realtimeStats.todayPageViews)}
            </p>
            <div className="flex justify-start">
              {getGrowthBadge(realtimeStats.last24hGrowth.pageViews, "24j")}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unique Visitors */}
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium truncate">Pengunjung Unik</CardTitle>
          <MousePointer className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-xl sm:text-2xl font-bold">
            {formatNumber(overview.totalUniqueVisitors)}
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground truncate">
              Total pengguna: {formatNumber(overview.totalUsers)}
            </p>
            <Badge variant="outline" className="text-xs w-fit px-1.5 py-0.5">
              <Activity className="h-3 w-3 mr-1" />
              <span className="hidden xs:inline">Aktif:</span>
              <span className="ml-1">{realtimeStats.activeNow}</span>
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Average Session Duration */}
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium truncate">
            Durasi Rata-rata
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-xl sm:text-2xl font-bold">
            {formatDuration(overview.avgSessionDuration)}
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground truncate">
              Per halaman: {formatDuration(overview.avgTimeOnPage)}
            </p>
            <Badge variant="outline" className="text-xs w-fit px-1.5 py-0.5">
              <Target className="h-3 w-3 mr-1" />
              <span className="hidden xs:inline">Bounce:</span>
              <span className="ml-1">{overview.bounceRate.toFixed(1)}%</span>
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}