"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ExternalLink, Clock, Users, Eye } from "lucide-react";
import { ContentStats, UserStats, GeographicStats } from "./statistics-types";

interface StatisticsTablesProps {
  contentStats: ContentStats;
  userStats: UserStats;
  geographicStats: GeographicStats;
  osStats: Record<string, number>;
}

export function StatisticsTables({
  contentStats,
  userStats,
  geographicStats,
  osStats,
}: StatisticsTablesProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Prepare OS data
  const osData = Object.entries(osStats)
    .map(([os, count]) => ({ os, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const maxOsCount = Math.max(...osData.map((item) => item.count), 1);

  // Prepare cities data
  const citiesData = Object.entries(geographicStats.topCities)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const maxCityCount = Math.max(...citiesData.map((item) => item.count), 1);

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Top Pages Table - Full Width */}
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
            Halaman Teratas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px] text-xs sm:text-sm">
                    Halaman
                  </TableHead>
                  <TableHead className="text-right min-w-[80px] text-xs sm:text-sm">
                    Views
                  </TableHead>
                  <TableHead className="text-right min-w-[100px] text-xs sm:text-sm hidden sm:table-cell">
                    Pengunjung Unik
                  </TableHead>
                  <TableHead className="text-right min-w-[80px] text-xs sm:text-sm">
                    Avg. Time
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contentStats.topPages.slice(0, 8).map((page, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2 max-w-[160px] sm:max-w-[200px]">
                        <span
                          className="truncate text-xs sm:text-sm"
                          title={page.page}
                        >
                          {page.page}
                        </span>
                        <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="secondary"
                        className="text-xs px-1.5 py-0.5"
                      >
                        {page.views.toLocaleString()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right hidden sm:table-cell">
                      <div className="flex items-center gap-1 justify-end">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs sm:text-sm">
                          {page.uniqueVisitors.toLocaleString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs sm:text-sm">
                          {formatTime(page.avgTime)}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Grid - Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* User Type Breakdown */}
        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <Users className="h-4 w-4" />
              Jenis Pengguna
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium truncate">
                  Authenticated
                </span>
                <Badge variant="default" className="text-xs px-1.5 py-0.5">
                  {userStats.userTypeBreakdown.authenticated.toLocaleString()}
                </Badge>
              </div>
              <Progress
                value={
                  (userStats.userTypeBreakdown.authenticated /
                    (userStats.userTypeBreakdown.authenticated +
                      userStats.userTypeBreakdown.anonymous)) *
                  100
                }
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium truncate">Anonymous</span>
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                  {userStats.userTypeBreakdown.anonymous.toLocaleString()}
                </Badge>
              </div>
              <Progress
                value={
                  (userStats.userTypeBreakdown.anonymous /
                    (userStats.userTypeBreakdown.authenticated +
                      userStats.userTypeBreakdown.anonymous)) *
                  100
                }
                className="h-2"
              />
            </div>

            <div className="pt-3 border-t space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground truncate">
                  Pengguna Baru
                </span>
                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                  {userStats.newUsers.toLocaleString()}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground truncate">
                  Pengguna Kembali
                </span>
                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                  {userStats.returningUsers.toLocaleString()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operating Systems */}
        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base">
              Sistem Operasi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-6">
            {osData.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium truncate max-w-[100px] sm:max-w-[120px]">
                    {item.os}
                  </span>
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                    {item.count.toLocaleString()}
                  </Badge>
                </div>
                <Progress
                  value={(item.count / maxOsCount) * 100}
                  className="h-1.5"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Geographic Stats */}
        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base">
              Statistik Geografis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-blue-600">
                  {geographicStats.totalCountries}
                </div>
                <p className="text-xs text-muted-foreground">Total Negara</p>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-green-600">
                  {geographicStats.totalCities}
                </div>
                <p className="text-xs text-muted-foreground">Total Kota</p>
              </div>
            </div>

            <div className="border-t pt-3">
              <h4 className="text-sm font-medium mb-2 sm:mb-3">Kota Teratas</h4>
              <div className="space-y-2">
                {citiesData.slice(0, 4).map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm truncate max-w-[60px] sm:max-w-[80px]">
                      {item.city}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-8 sm:w-12 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{
                            width: `${(item.count / maxCityCount) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground min-w-[1.5rem] text-right">
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance & Summary */}
        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base">
              Ringkasan Performa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground truncate max-w-[120px] sm:max-w-none">
                  Rata-rata waktu di halaman
                </span>
                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                  {formatTime(contentStats.avgTimeOnPage)}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground truncate max-w-[120px] sm:max-w-none">
                  Total halaman populer
                </span>
                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                  {contentStats.topPages.length}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground truncate max-w-[120px] sm:max-w-none">
                  Total OS berbeda
                </span>
                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                  {osData.length}
                </Badge>
              </div>
            </div>

            <div className="pt-3 border-t">
              <h4 className="text-sm font-medium mb-2">Top Page Performance</h4>
              {contentStats.topPages.slice(0, 3).map((page, index) => (
                <div key={index} className="text-xs text-muted-foreground mb-1">
                  <span className="font-medium">#{index + 1}</span>{" "}
                  <span className="truncate inline-block max-w-[80px] sm:max-w-[120px]">
                    {page.page}
                  </span>
                  <span className="ml-1 sm:ml-2 text-green-600">
                    {page.views} views
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
