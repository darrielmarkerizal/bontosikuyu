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
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 sm:mb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
                Statistik Website
              </h1>
            </div>
            {performance?.optimized && (
              <Badge variant="secondary" className="text-xs w-fit">
                <TrendingUp className="h-3 w-3 mr-1" />
                Optimized
              </Badge>
            )}
          </div>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Dashboard analitik dan statistik pengunjung website Desa Laiyolo
            Baru
          </p>
        </div>
      </div>

      {performance && (
        <div className="flex items-center gap-1 pt-2 border-t border-muted">
          <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          <span className="text-xs text-muted-foreground">
            Query time: {performance.queryTime}
          </span>
        </div>
      )}
    </div>
  );
}
