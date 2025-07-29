import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Tag, TrendingUp, Camera } from "lucide-react";

interface OverallStats {
  totalTravels: number;
  dusunCounts: Record<string, number>;
  categoryCounts: Record<string, number>;
}

interface WisataStatsProps {
  overallStats: OverallStats;
  loading: boolean;
}

export function WisataStats({ overallStats, loading }: WisataStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-16" />
                  <div className="h-8 bg-gray-200 rounded w-12" />
                </div>
                <div className="h-10 w-10 bg-gray-200 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const dusunEntries = Object.entries(overallStats.dusunCounts);
  const categoryEntries = Object.entries(overallStats.categoryCounts);

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Wisata */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 font-plus-jakarta-sans">
                  Total Wisata
                </p>
                <p className="text-3xl font-bold text-gray-900 font-sentient">
                  {overallStats.totalTravels}
                </p>
              </div>
              <div className="h-12 w-12 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                <Camera className="h-6 w-6 text-brand-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dusun Count */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 font-plus-jakarta-sans">
                  Total Dusun
                </p>
                <p className="text-3xl font-bold text-gray-900 font-sentient">
                  {dusunEntries.length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Count */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 font-plus-jakarta-sans">
                  Kategori
                </p>
                <p className="text-3xl font-bold text-gray-900 font-sentient">
                  {categoryEntries.length}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Tag className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Most Popular Dusun */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 font-plus-jakarta-sans">
                  Terpopuler
                </p>
                <p className="text-lg font-bold text-gray-900 font-sentient truncate">
                  {dusunEntries.length > 0
                    ? dusunEntries
                        .reduce((a, b) => (a[1] > b[1] ? a : b))[0]
                        .replace("Dusun ", "")
                    : "-"}
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dusun Distribution */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-sentient">
              Distribusi per Dusun
            </h3>
            <div className="space-y-3">
              {dusunEntries.map(([dusun, count]) => (
                <div key={dusun} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 font-plus-jakarta-sans truncate">
                    {dusun.replace("Dusun ", "")}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full min-w-16">
                      <div
                        className="h-2 bg-brand-primary rounded-full"
                        style={{
                          width: `${(count / Math.max(...dusunEntries.map(([, c]) => c))) * 100}%`,
                        }}
                      />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-sentient">
              Distribusi per Kategori
            </h3>
            <div className="space-y-3">
              {categoryEntries.map(([category, count]) => (
                <div
                  key={category}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-gray-700 font-plus-jakarta-sans truncate">
                    {category}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full min-w-16">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{
                          width: `${(count / Math.max(...categoryEntries.map(([, c]) => c))) * 100}%`,
                        }}
                      />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
