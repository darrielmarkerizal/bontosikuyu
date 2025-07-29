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

interface TravelFiltersProps {
  search: string;
  selectedCategory: string;
  selectedDusun: string;
  categories: Array<{ id: number; name: string }>;
  dusunOptions: string[];
  onSearch: (value: string) => void;
  onCategoryFilter: (categoryId: string) => void;
  onDusunFilter: (dusun: string) => void;
  onSort: (field: string, order: "ASC" | "DESC") => void;
  currentSort: { field: string; order: "ASC" | "DESC" };
}

export function TravelFilters({
  search,
  selectedCategory,
  selectedDusun,
  categories,
  dusunOptions,
  onSearch,
  onCategoryFilter,
  onDusunFilter,
  onSort,
  currentSort,
}: TravelFiltersProps) {
  const handleSortChange = (value: string) => {
    const [field, order] = value.split("-");
    onSort(field, order as "ASC" | "DESC");
  };

  const getSortValue = () => {
    return `${currentSort.field}-${currentSort.order}`;
  };

  const clearFilters = () => {
    onSearch("");
    onCategoryFilter("all");
    onDusunFilter("all");
  };

  const hasActiveFilters =
    search ||
    (selectedCategory && selectedCategory !== "all") ||
    (selectedDusun && selectedDusun !== "all");

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
                  placeholder="Cari destinasi wisata berdasarkan nama..."
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

            {/* Category Filter */}
            <div className="w-full lg:w-48">
              <Select
                value={selectedCategory || "all"}
                onValueChange={(value) =>
                  onCategoryFilter(value === "all" ? "all" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kategori Wisata" />
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

            {/* Dusun Filter */}
            <div className="w-full lg:w-48">
              <Select
                value={selectedDusun || "all"}
                onValueChange={(value) =>
                  onDusunFilter(value === "all" ? "all" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Dusun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Dusun</SelectItem>
                  {dusunOptions.map((dusun) => (
                    <SelectItem key={dusun} value={dusun}>
                      {dusun}
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
                  <SelectItem value="name-ASC">Nama A-Z</SelectItem>
                  <SelectItem value="name-DESC">Nama Z-A</SelectItem>
                  <SelectItem value="dusun-ASC">Dusun A-Z</SelectItem>
                  <SelectItem value="dusun-DESC">Dusun Z-A</SelectItem>
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

              {selectedCategory && selectedCategory !== "all" && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-purple-50 text-purple-700 hover:bg-purple-100"
                >
                  Kategori:{" "}
                  {
                    categories.find((c) => c.id.toString() === selectedCategory)
                      ?.name
                  }
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

              {selectedDusun && selectedDusun !== "all" && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-green-50 text-green-700 hover:bg-green-100"
                >
                  Dusun: {selectedDusun}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDusunFilter("all")}
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
