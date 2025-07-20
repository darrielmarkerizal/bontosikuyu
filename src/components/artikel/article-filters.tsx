"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ArrowUpDown, X } from "lucide-react";

interface ArticleFiltersProps {
  search: string;
  status: string;
  categoryId: string;
  categories: Array<{ id: number; name: string }>;
  onSearch: (search: string) => void;
  onStatusFilter: (status: string) => void;
  onCategoryFilter: (categoryId: string) => void;
  onSort: (field: string, order: "ASC" | "DESC") => void;
  currentSort: { field: string; order: "ASC" | "DESC" };
}

export function ArticleFilters({
  search,
  status,
  categoryId,
  categories,
  onSearch,
  onStatusFilter,
  onCategoryFilter,
  onSort,
  currentSort,
}: ArticleFiltersProps) {
  const handleSort = (field: string) => {
    const newOrder =
      currentSort.field === field && currentSort.order === "ASC"
        ? "DESC"
        : "ASC";
    onSort(field, newOrder);
  };

  const clearFilters = () => {
    onSearch("");
    onStatusFilter("all");
    onCategoryFilter("all");
  };

  const hasActiveFilters =
    search ||
    (status && status !== "all") ||
    (categoryId && categoryId !== "all");

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Main Filters Row */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari artikel berdasarkan judul atau konten..."
                  value={search}
                  onChange={(e) => onSearch(e.target.value)}
                  className="pl-10"
                />
                {search && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSearch("")}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-full lg:w-48">
              <Select
                value={status || "all"}
                onValueChange={(value) =>
                  onStatusFilter(value === "all" ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status Artikel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="publish">Dipublikasi</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="w-full lg:w-48">
              <Select
                value={categoryId || "all"}
                onValueChange={(value) =>
                  onCategoryFilter(value === "all" ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kategori Artikel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Button */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSort("createdAt")}
                className={`${
                  currentSort.field === "createdAt"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                    : "hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Tanggal
                {currentSort.field === "createdAt" && (
                  <span className="ml-1 text-xs">
                    {currentSort.order === "ASC" ? "↑" : "↓"}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Filter Aktif:</span>

              {search && (
                <Badge variant="secondary" className="text-xs">
                  Pencarian: &quot;{search}&quot;
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSearch("")}
                    className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {status && status !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Status: {status === "publish" ? "Dipublikasi" : "Draft"}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onStatusFilter("all")}
                    className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {categoryId && categoryId !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Kategori:{" "}
                  {categories.find((c) => c.id.toString() === categoryId)?.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCategoryFilter("all")}
                    className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs text-red-600 hover:text-red-700"
              >
                Hapus Semua Filter
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
