"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MapPin, TrendingUp, User } from "lucide-react";

interface WriterStatsProps {
  totalWriters: number;
  dusunCounts: Record<string, number>;
}

export function WriterStats({ totalWriters, dusunCounts }: WriterStatsProps) {
  const mostActiveDusun = Object.entries(dusunCounts).reduce(
    (prev, current) => (current[1] > prev[1] ? current : prev),
    ["", 0]
  );

  const averagePerDusun =
    totalWriters > 0
      ? Math.round(totalWriters / Object.keys(dusunCounts).length)
      : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Penulis</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalWriters}</div>
          <p className="text-xs text-muted-foreground">
            Semua penulis terdaftar
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dusun Terbanyak</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {mostActiveDusun[1]}
          </div>
          <p className="text-xs text-muted-foreground">
            {mostActiveDusun[0] || "Belum ada data"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Rata-rata per Dusun
          </CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {averagePerDusun}
          </div>
          <p className="text-xs text-muted-foreground">Penulis per dusun</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sebaran Dusun</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {Object.keys(dusunCounts).length}
          </div>
          <p className="text-xs text-muted-foreground">
            Dusun memiliki penulis
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
