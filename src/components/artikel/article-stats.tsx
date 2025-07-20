"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Eye, Clock, TrendingUp } from "lucide-react";

interface ArticleStatsProps {
  totalArticles: number;
  statusCounts: Record<string, number>;
}

export function ArticleStats({
  totalArticles,
  statusCounts,
}: ArticleStatsProps) {
  const publishedCount = statusCounts.publish || 0;
  const draftCount = statusCounts.draft || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Artikel</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalArticles}</div>
          <p className="text-xs text-muted-foreground">
            Semua artikel dalam sistem
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dipublikasi</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {publishedCount}
          </div>
          <p className="text-xs text-muted-foreground">
            Artikel yang sudah dipublikasi
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Draft</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{draftCount}</div>
          <p className="text-xs text-muted-foreground">
            Artikel dalam status draft
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rasio Publikasi</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {totalArticles > 0
              ? Math.round((publishedCount / totalArticles) * 100)
              : 0}
            %
          </div>
          <p className="text-xs text-muted-foreground">
            Persentase artikel yang dipublikasi
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
