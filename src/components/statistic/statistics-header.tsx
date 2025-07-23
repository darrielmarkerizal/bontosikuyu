import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Clock } from "lucide-react";

interface StatisticsHeaderProps {
  performance?: {
    queryTime: string;
    optimized: boolean;
  };
}

export function StatisticsHeader({ performance }: StatisticsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Statistik Website</h1>
          {performance?.optimized && (
            <Badge variant="secondary" className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              Optimized
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          Dashboard analitik dan statistik pengunjung website Desa Laiyolo Baru
        </p>
        {performance && (
          <div className="flex items-center gap-1 mt-2">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Query time: {performance.queryTime}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
