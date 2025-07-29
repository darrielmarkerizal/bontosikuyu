import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Database,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface LogsStatsProps {
  totalLogs: number;
  actionCounts: Record<string, number>;
  recentActivity: {
    today: number;
    yesterday: number;
    thisWeek: number;
  };
}

export function LogsStats({ totalLogs, recentActivity }: LogsStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Logs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Log</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalLogs.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Semua aktivitas tercatat
          </p>
        </CardContent>
      </Card>

      {/* Today's Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hari Ini</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{recentActivity.today}</div>
          <p className="text-xs text-muted-foreground">Aktivitas hari ini</p>
        </CardContent>
      </Card>

      {/* Yesterday's Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Kemarin</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{recentActivity.yesterday}</div>
          <p className="text-xs text-muted-foreground">Aktivitas kemarin</p>
        </CardContent>
      </Card>

      {/* This Week's Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Minggu Ini</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{recentActivity.thisWeek}</div>
          <p className="text-xs text-muted-foreground">Aktivitas minggu ini</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Top Actions Card
export function TopActionsCard({
  actionCounts,
}: {
  actionCounts: Record<string, number>;
}) {
  const topActions = Object.entries(actionCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Database className="h-4 w-4" />
          Aksi Teratas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topActions.map(([action, count]) => (
            <div key={action} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">(action) </span>
                <span className="text-sm font-medium">{action}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {count.toLocaleString()}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
