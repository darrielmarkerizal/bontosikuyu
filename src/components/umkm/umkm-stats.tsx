import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, MapPin } from "lucide-react";

interface UmkmStatsProps {
  totalUmkm: number;
  dusunCounts: Record<string, number>;
}

export function UmkmStats({ totalUmkm, dusunCounts }: UmkmStatsProps) {
  const dusunList = [
    "Dusun Laiyolo",
    "Dusun Pangkaje'ne",
    "Dusun Timoro",
    "Dusun Kilotepo",
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {/* Total UMKM */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total UMKM</CardTitle>
          <Store className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUmkm}</div>
          <p className="text-xs text-muted-foreground">
            Seluruh UMKM terdaftar
          </p>
        </CardContent>
      </Card>

      {/* Dusun Breakdown */}
      {dusunList.map((dusun) => (
        <Card key={dusun}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {dusun.replace("Dusun ", "")}
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dusunCounts[dusun] || 0}</div>
            <p className="text-xs text-muted-foreground">
              UMKM di {dusun.replace("Dusun ", "")}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
