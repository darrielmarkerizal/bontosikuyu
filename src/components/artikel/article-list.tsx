import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, FileText, Plus } from "lucide-react";
import { ArticleCard } from "./public/article-card";
import { Article } from "./public/types"; // Use the correct Article type

interface ArticleListProps {
  articles: Article[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onEditArticle?: (id: number) => void;
  onMoreOptions?: (id: number) => void;
  onAddFirstArticle?: () => void;
}

export function ArticleList({
  articles,
  searchTerm,
  onSearchChange,

  onAddFirstArticle,
}: ArticleListProps) {
  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Artikel</CardTitle>
        <CardDescription>
          Kelola semua artikel yang telah dibuat
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari artikel, penulis, atau kategori..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article, index) => (
            <ArticleCard key={article.id} article={article} index={index} />
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Tidak ada artikel ditemukan
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? `Tidak ada artikel yang cocok dengan pencarian "${searchTerm}"`
                : "Belum ada artikel yang dibuat. Mulai dengan membuat artikel pertama Anda."}
            </p>
            {!searchTerm && (
              <Button onClick={onAddFirstArticle}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Artikel Pertama
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
