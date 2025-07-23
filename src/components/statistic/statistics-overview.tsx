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
          <Badge variant="secondary" className="text-xs">
            <Activity className="h-3 w-3 mr-1" />
            {label}
          </Badge>
        ) : (
          <Badge
            variant={isPositive ? "default" : "destructive"}
            className="text-xs"
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            {Math.abs(growth).toFixed(1)}% {label}
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Sessions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sesi</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(overview.totalSessions)}
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">
              Hari ini: {formatNumber(realtimeStats.todaySessions)}
            </p>
            {getGrowthBadge(realtimeStats.last24hGrowth.sessions, "24j")}
          </div>
        </CardContent>
      </Card>

      {/* Total Page Views */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Tayangan Halaman
          </CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(overview.totalPageViews)}
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">
              Hari ini: {formatNumber(realtimeStats.todayPageViews)}
            </p>
            {getGrowthBadge(realtimeStats.last24hGrowth.pageViews, "24j")}
          </div>
        </CardContent>
      </Card>

      {/* Unique Visitors */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pengunjung Unik</CardTitle>
          <MousePointer className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(overview.totalUniqueVisitors)}
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">
              Total pengguna: {formatNumber(overview.totalUsers)}
            </p>
            <Badge variant="outline" className="text-xs">
              <Activity className="h-3 w-3 mr-1" />
              Aktif: {realtimeStats.activeNow}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Average Session Duration */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Durasi Rata-rata
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatDuration(overview.avgSessionDuration)}
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">
              Waktu per halaman: {formatDuration(overview.avgTimeOnPage)}
            </p>
            <Badge variant="outline" className="text-xs">
              <Target className="h-3 w-3 mr-1" />
              Bounce: {overview.bounceRate.toFixed(1)}%
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
