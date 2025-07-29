import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, TrendingUp, BarChart3 } from "lucide-react";

interface TravelStatsProps {
  stats: {
    totalTravels: number;
    dusunCounts: Record<string, number>;
    categoryCounts: Record<string, number>;
  };
}

export function TravelStats({ stats }: TravelStatsProps) {
  const topDusun = Object.entries(stats.dusunCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 1)[0];

  const topCategory = Object.entries(stats.categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 1)[0];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Destinasi</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTravels}</div>
          <p className="text-xs text-muted-foreground">
            Destinasi wisata tersedia
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dusun Terbanyak</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topDusun ? topDusun[1] : 0}</div>
          <p className="text-xs text-muted-foreground">
            {topDusun ? topDusun[0].replace("Dusun ", "") : "Tidak ada data"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Kategori Terbanyak
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {topCategory ? topCategory[1] : 0}
          </div>
          <p className="text-xs text-muted-foreground">
            {topCategory ? topCategory[0] : "Tidak ada data"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Rata-rata per Dusun
          </CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Object.keys(stats.dusunCounts).length > 0
              ? Math.round(
                  stats.totalTravels / Object.keys(stats.dusunCounts).length
                )
              : 0}
          </div>
          <p className="text-xs text-muted-foreground">Destinasi per dusun</p>
        </CardContent>
      </Card>
    </div>
  );
}
