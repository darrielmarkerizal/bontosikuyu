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
    .slice(0, 8);

  const maxOsCount = Math.max(...osData.map((item) => item.count));

  // Prepare cities data
  const citiesData = Object.entries(geographicStats.topCities)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const maxCityCount = Math.max(...citiesData.map((item) => item.count));

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Top Pages Table */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Halaman Teratas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Halaman</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Pengunjung Unik</TableHead>
                  <TableHead className="text-right">Avg. Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contentStats.topPages.map((page, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span
                          className="truncate max-w-[200px]"
                          title={page.page}
                        >
                          {page.page}
                        </span>
                        <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">
                        {page.views.toLocaleString()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        {page.uniqueVisitors.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {formatTime(page.avgTime)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* User Type Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Jenis Pengguna
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Authenticated</span>
              <Badge variant="default">
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
              <span className="text-sm font-medium">Anonymous</span>
              <Badge variant="secondary">
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

          <div className="pt-4 border-t space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Pengguna Baru
              </span>
              <Badge variant="outline">
                {userStats.newUsers.toLocaleString()}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Pengguna Kembali
              </span>
              <Badge variant="outline">
                {userStats.returningUsers.toLocaleString()}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operating Systems */}
      <Card>
        <CardHeader>
          <CardTitle>Sistem Operasi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {osData.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium truncate">{item.os}</span>
                <Badge variant="secondary" className="text-xs">
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
      <Card>
        <CardHeader>
          <CardTitle>Statistik Geografis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {geographicStats.totalCountries}
              </div>
              <p className="text-xs text-muted-foreground">Total Negara</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {geographicStats.totalCities}
              </div>
              <p className="text-xs text-muted-foreground">Total Kota</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-3">Kota Teratas</h4>
            <div className="space-y-2">
              {citiesData.slice(0, 5).map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm truncate">{item.city}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{
                          width: `${(item.count / maxCityCount) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground min-w-[3rem] text-right">
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
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Performa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Rata-rata waktu di halaman
              </span>
              <Badge variant="outline">
                {formatTime(contentStats.avgTimeOnPage)}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Total halaman populer
              </span>
              <Badge variant="outline">{contentStats.topPages.length}</Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Total OS berbeda
              </span>
              <Badge variant="outline">{osData.length}</Badge>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Top Page Performance</h4>
            {contentStats.topPages.slice(0, 3).map((page, index) => (
              <div key={index} className="text-xs text-muted-foreground mb-1">
                <span className="font-medium">#{index + 1}</span>{" "}
                {page.page.slice(0, 20)}...
                <span className="ml-2 text-green-600">{page.views} views</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
