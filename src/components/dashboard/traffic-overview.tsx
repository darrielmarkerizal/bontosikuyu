import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Eye, User } from "lucide-react";
import { formatNumber, getGrowthColor } from "./utils";
import { GrowthIcon } from "./growth-icon";
import { DashboardData } from "./types";

interface TrafficOverviewProps {
  data: DashboardData;
}

export function TrafficOverview({ data }: TrafficOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sesi Hari Ini</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(data.trafficInsights.todayStats.sessions)}
          </div>
          <div className="flex items-center gap-1 text-xs">
            <GrowthIcon value={data.trafficInsights.weeklyGrowth.sessions} />
            <span
              className={getGrowthColor(
                data.trafficInsights.weeklyGrowth.sessions
              )}
            >
              {Math.abs(data.trafficInsights.weeklyGrowth.sessions).toFixed(1)}%
            </span>
            <span className="text-muted-foreground">dari minggu lalu</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Tayangan Hari Ini
          </CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(data.trafficInsights.todayStats.pageViews)}
          </div>
          <div className="flex items-center gap-1 text-xs">
            <GrowthIcon value={data.trafficInsights.weeklyGrowth.pageViews} />
            <span
              className={getGrowthColor(
                data.trafficInsights.weeklyGrowth.pageViews
              )}
            >
              {Math.abs(data.trafficInsights.weeklyGrowth.pageViews).toFixed(1)}
              %
            </span>
            <span className="text-muted-foreground">dari minggu lalu</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pengunjung Unik</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(data.trafficInsights.todayStats.uniqueVisitors)}
          </div>
          <p className="text-xs text-muted-foreground">Hari ini</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sesi Aktif</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(data.overview.activeSessions)}
          </div>
          <p className="text-xs text-muted-foreground">Saat ini</p>
        </CardContent>
      </Card>
    </div>
  );
}
