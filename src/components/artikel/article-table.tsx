"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Eye, Trash2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface Article {
  id: number;
  title: string;
  content: string;
  status: "draft" | "publish";
  imageUrl?: string;
  category: {
    id: number;
    name: string;
  };
  writer: {
    id: number;
    fullName: string;
    dusun: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ArticleTableProps {
  articles: Article[];
  loading?: boolean;
}

const statusConfig = {
  publish: {
    label: "Dipublikasi",
    className: "bg-green-100 text-green-800 hover:bg-green-200",
  },
  draft: {
    label: "Draft",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  },
};

export function ArticleTable({ articles, loading }: ArticleTableProps) {
  const removeMarkdown = (text: string): string => {
    return (
      text
        // Remove headers (# ## ### etc.)
        .replace(/^#{1,6}\s+/gm, "")
        // Remove bold (**text** or __text__)
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/__(.*?)__/g, "$1")
        // Remove italic (*text* or _text_)
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/_(.*?)_/g, "$1")
        // Remove links [text](url)
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        // Remove inline code `code`
        .replace(/`([^`]+)`/g, "$1")
        // Remove code blocks ```code```
        .replace(/```[\s\S]*?```/g, "")
        // Remove numbered lists (1. 2. etc.)
        .replace(/^\d+\.\s+/gm, "")
        // Remove bullet lists (- * +)
        .replace(/^[-*+]\s+/gm, "")
        // Remove blockquotes (> text)
        .replace(/^>\s+/gm, "")
        // Remove horizontal rules (---, ___, ***)
        .replace(/^[-*_]{3,}$/gm, "")
        // Remove HTML tags
        .replace(/<[^>]*>/g, "")
        // Remove extra whitespace and newlines
        .replace(/\n+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    );
  };

  const truncateText = (text: string, maxLength: number): string => {
    const cleanText = removeMarkdown(text);
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength) + "...";
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: id });
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        {/* Container with responsive horizontal scroll */}
        <div className="w-full overflow-x-auto">
          {/* Wrapper untuk mengatur min-width tabel */}
          <div className="min-w-full xl:min-w-0">
            <Table className="w-full xl:table-fixed">
              <TableHeader>
                <TableRow>
                  {/* Desktop: fixed width, Mobile/Tablet: flexible width dengan min-width */}
                  <TableHead className="xl:w-[45%] min-w-[280px] sm:min-w-[320px] lg:min-w-[350px]">
                    Judul
                  </TableHead>
                  <TableHead className="xl:w-[12%] min-w-[100px] sm:min-w-[120px]">
                    Kategori
                  </TableHead>
                  <TableHead className="xl:w-[15%] min-w-[140px] sm:min-w-[160px]">
                    Penulis
                  </TableHead>
                  <TableHead className="xl:w-[10%] min-w-[100px] sm:min-w-[110px]">
                    Status
                  </TableHead>
                  <TableHead className="xl:w-[10%] min-w-[120px] sm:min-w-[130px]">
                    Tanggal Dibuat
                  </TableHead>
                  <TableHead className="xl:w-[8%] min-w-[80px] text-right">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="align-middle xl:max-w-0">
                      <div className="space-y-1">
                        <p
                          className="font-medium text-sm xl:truncate"
                          title={article.title}
                        >
                          {article.title}
                        </p>
                        <p
                          className="text-xs text-gray-500 xl:truncate"
                          title={removeMarkdown(article.content)}
                        >
                          {truncateText(article.content, 150)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="align-middle">
                      <Badge
                        variant="outline"
                        className="text-xs whitespace-nowrap"
                      >
                        {article.category.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-middle xl:max-w-0">
                      <div className="space-y-1">
                        <p
                          className="text-sm font-medium xl:truncate"
                          title={article.writer.fullName}
                        >
                          {article.writer.fullName}
                        </p>
                        <p
                          className="text-xs text-gray-500 xl:truncate"
                          title={article.writer.dusun}
                        >
                          {article.writer.dusun}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="align-middle">
                      <Badge
                        className={`${statusConfig[article.status].className} whitespace-nowrap`}
                      >
                        {statusConfig[article.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-middle">
                      <span className="text-sm text-gray-600 whitespace-nowrap">
                        {formatDate(article.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right align-middle">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
