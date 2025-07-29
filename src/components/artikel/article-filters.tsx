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
import { Search, X } from "lucide-react";

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
  const handleSortChange = (value: string) => {
    const [field, order] = value.split("-");
    onSort(field, order as "ASC" | "DESC");
  };

  const getSortValue = () => {
    return `${currentSort.field}-${currentSort.order}`;
  };

  const clearFilters = () => {
    onSearch("");
    onStatusFilter("");
    onCategoryFilter("");
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

            {/* Sort Select */}
            <div className="w-full lg:w-48">
              <Select value={getSortValue()} onValueChange={handleSortChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-DESC">Terbaru</SelectItem>
                  <SelectItem value="createdAt-ASC">Terlama</SelectItem>
                  <SelectItem value="title-ASC">Judul A-Z</SelectItem>
                  <SelectItem value="title-DESC">Judul Z-A</SelectItem>
                  <SelectItem value="updatedAt-DESC">Update Terbaru</SelectItem>
                  <SelectItem value="updatedAt-ASC">Update Terlama</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Filter Aktif:</span>

              {search && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
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
                <Badge
                  variant="secondary"
                  className="text-xs bg-green-50 text-green-700 hover:bg-green-100"
                >
                  Status: {status === "publish" ? "Dipublikasi" : "Draft"}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onStatusFilter("")}
                    className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {categoryId && categoryId !== "all" && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-purple-50 text-purple-700 hover:bg-purple-100"
                >
                  Kategori:{" "}
                  {categories.find((c) => c.id.toString() === categoryId)?.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCategoryFilter("")}
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
