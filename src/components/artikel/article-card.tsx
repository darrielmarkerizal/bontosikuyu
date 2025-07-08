import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User, Eye, MoreHorizontal, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { Article, statusColors, statusLabels } from "./article-types";

interface ArticleCardProps {
  article: Article;
  onEdit?: (id: number) => void;
  onMoreOptions?: (id: number) => void;
}

export function ArticleCard({
  article,
  onEdit,
  onMoreOptions,
}: ArticleCardProps) {
  const router = useRouter();

  const handleEdit = () => {
    if (onEdit) {
      onEdit(article.id);
    } else {
      router.push(`/dashboard/artikel/edit/${article.id}`);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-muted relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-2 right-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
              statusColors[article.status as keyof typeof statusColors]
            }`}
          >
            {statusLabels[article.status as keyof typeof statusLabels]}
          </span>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2 mb-2">
              {article.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {article.excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                {new Date(article.publishDate).toLocaleDateString("id-ID")}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="h-3 w-3" />
              <span>{article.views} views</span>
            </div>
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              {article.category}
            </span>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleEdit}
            >
              <Edit className="mr-1 h-3 w-3" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMoreOptions?.(article.id)}
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
