import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Store, MapPin, Users } from "lucide-react";
import { formatNumber } from "./utils";
import { DashboardData } from "./types";

interface OverviewCardsProps {
  data: DashboardData;
}

export function OverviewCards({ data }: OverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Artikel</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(data.overview.totalArticles)}
          </div>
          <p className="text-xs text-muted-foreground">
            {data.quickStats.articlesByStatus.published} published,{" "}
            {data.quickStats.articlesByStatus.draft} draft
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total UMKM</CardTitle>
          <Store className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(data.overview.totalUmkm)}
          </div>
          <p className="text-xs text-muted-foreground">
            {Object.keys(data.quickStats.umkmByDusun).length} dusun
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Wisata</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(data.overview.totalTravels)}
          </div>
          <p className="text-xs text-muted-foreground">
            {Object.keys(data.quickStats.travelsByDusun).length} dusun
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Penulis</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(data.overview.totalWriters)}
          </div>
          <p className="text-xs text-muted-foreground">
            {Object.keys(data.quickStats.writersByDusun).length} dusun
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
