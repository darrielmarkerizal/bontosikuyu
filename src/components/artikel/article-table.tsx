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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useRouter } from "next/navigation";

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

interface LexicalNode {
  type: string;
  text?: string;
  children?: LexicalNode[];
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

export function ArticleTable({ articles }: ArticleTableProps) {
  const router = useRouter();

  const parseLexicalContent = (content: string): string => {
    try {
      const parsed = JSON.parse(content);

      if (!parsed.root || !parsed.root.children) {
        return content;
      }

      const extractText = (node: LexicalNode): string => {
        if (node.type === "text") {
          return node.text || "";
        }

        if (node.children) {
          return node.children.map(extractText).join(" ");
        }

        return "";
      };

      const textContent = parsed.root.children.map(extractText).join(" ");
      return textContent.trim();
    } catch {
      // If parsing fails, return original content
      return content;
    }
  };

  const truncateText = (text: string, maxLength: number): string => {
    const cleanText = parseLexicalContent(text);
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
    <TooltipProvider>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[35%] min-w-[200px]">Judul</TableHead>
                  <TableHead className="w-[12%] min-w-[100px]">
                    Kategori
                  </TableHead>
                  <TableHead className="w-[18%] min-w-[140px]">
                    Penulis
                  </TableHead>
                  <TableHead className="w-[10%] min-w-[80px]">Status</TableHead>
                  <TableHead className="w-[12%] min-w-[100px]">
                    Tanggal Dibuat
                  </TableHead>
                  <TableHead className="w-[13%] min-w-[80px] text-right">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="align-middle">
                      <div className="space-y-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="font-medium text-sm truncate cursor-help">
                              {article.title}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{article.title}</p>
                          </TooltipContent>
                        </Tooltip>
                        <p
                          className="text-xs text-gray-500 truncate"
                          title={parseLexicalContent(article.content)}
                        >
                          {truncateText(article.content, 80)}
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
                    <TableCell className="align-middle">
                      <div className="space-y-1">
                        <p
                          className="text-sm font-medium truncate"
                          title={article.writer.fullName}
                        >
                          {article.writer.fullName}
                        </p>
                        <p
                          className="text-xs text-gray-500 truncate"
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
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Buka menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/dashboard/artikel/${article.id}`)
                            }
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/dashboard/artikel/edit/${article.id}`
                              )
                            }
                          >
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
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
