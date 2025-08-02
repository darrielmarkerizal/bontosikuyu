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
import { Edit, Eye, MoreHorizontal } from "lucide-react";
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

interface ArticleTableProps {
  articles: Article[];
  loading?: boolean;
}

const statusConfig = {
  publish: {
    label: "Dipublikasi",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  },
  draft: {
    label: "Draft",
    className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  },
};

export function ArticleTable({ articles }: ArticleTableProps) {
  const router = useRouter();

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
                  <TableHead className="w-[28%] max-w-[250px]">Judul</TableHead>
                  <TableHead className="w-[15%] max-w-[120px]">
                    Kategori
                  </TableHead>
                  <TableHead className="w-[22%] max-w-[200px]">
                    Penulis
                  </TableHead>
                  <TableHead className="w-[12%] max-w-[100px]">
                    Status
                  </TableHead>
                  <TableHead className="w-[13%] max-w-[120px]">
                    Tanggal Dibuat
                  </TableHead>
                  <TableHead className="w-[10%] max-w-[80px] text-right">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="align-middle max-w-[250px]">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="font-medium text-sm truncate cursor-help max-w-[230px]">
                            {article.title}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{article.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="align-middle max-w-[120px]">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant="outline"
                            className="text-xs whitespace-nowrap bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 truncate max-w-[100px]"
                          >
                            {article.category.name}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{article.category.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="align-middle max-w-[200px]">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="space-y-1 max-w-[180px]">
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
                        </TooltipTrigger>
                        <TooltipContent>
                          <div>
                            <p className="font-medium">
                              {article.writer.fullName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {article.writer.dusun}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="align-middle max-w-[100px]">
                      <Badge
                        className={`${statusConfig[article.status].className} whitespace-nowrap text-xs`}
                      >
                        {statusConfig[article.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-middle max-w-[120px]">
                      <span className="text-sm text-gray-600 whitespace-nowrap">
                        {formatDate(article.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right align-middle max-w-[80px]">
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
