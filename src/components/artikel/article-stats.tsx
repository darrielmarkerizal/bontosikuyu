import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Eye } from "lucide-react";
import { Article } from "./article-types";

interface ArticleStatsProps {
  articles: Article[];
}

export function ArticleStats({ articles }: ArticleStatsProps) {
  const publishedCount = articles.filter(
    (a) => a.status === "published"
  ).length;
  const draftCount = articles.filter((a) => a.status === "draft").length;
  const totalViews = articles.reduce((sum, article) => sum + article.views, 0);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Artikel</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{articles.length}</div>
          <p className="text-xs text-muted-foreground">+3 artikel bulan ini</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dipublikasi</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{publishedCount}</div>
          <p className="text-xs text-muted-foreground">
            {draftCount} draft menunggu
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalViews.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">+12% dari bulan lalu</p>
        </CardContent>
      </Card>
    </div>
  );
}
