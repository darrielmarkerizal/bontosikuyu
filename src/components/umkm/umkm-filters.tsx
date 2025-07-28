"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  X,
  SortAsc,
  SortDesc,
  MapPin,
  Tag,
} from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface UmkmFiltersProps {
  search: string;
  selectedCategory: string;
  selectedDusun: string;
  categories: Category[];
  dusunOptions: string[];
  onSearch: (search: string) => void;
  onCategoryFilter: (categoryId: string) => void;
  onDusunFilter: (dusun: string) => void;
  onSort: (field: string, order: "ASC" | "DESC") => void;
  onResetFilters: () => void;
  currentSort: { field: string; order: "ASC" | "DESC" };
  loading: boolean;
  totalItems: number;
}

export default function UmkmFilters({
  search,
  selectedCategory,
  selectedDusun,
  categories,
  dusunOptions,
  onSearch,
  onCategoryFilter,
  onDusunFilter,
  onSort,
  onResetFilters,
  currentSort,
  loading,
  totalItems,
}: UmkmFiltersProps) {
  const sortOptions = [
    {
      value: "umkmName-ASC",
      label: "Nama A-Z",
      field: "umkmName",
      order: "ASC" as const,
    },
    {
      value: "umkmName-DESC",
      label: "Nama Z-A",
      field: "umkmName",
      order: "DESC" as const,
    },
    {
      value: "createdAt-DESC",
      label: "Terbaru",
      field: "createdAt",
      order: "DESC" as const,
    },
    {
      value: "createdAt-ASC",
      label: "Terlama",
      field: "createdAt",
      order: "ASC" as const,
    },
  ];

  const activeFiltersCount = [
    search,
    selectedCategory !== "all" ? selectedCategory : null,
    selectedDusun !== "all" ? selectedDusun : null,
  ].filter(Boolean).length;

  const selectedCategoryName = categories.find(
    (cat) => cat.id.toString() === selectedCategory
  )?.name;

  const currentSortValue = `${currentSort.field}-${currentSort.order}`;

  return (
    <Card className="border-0 bg-white shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-brand-secondary font-sentient">
          <Filter className="h-5 w-5" />
          Filter & Pencarian
        </CardTitle>
        {totalItems > 0 && (
          <p className="text-sm text-gray-600 font-plus-jakarta-sans">
            {totalItems} UMKM ditemukan
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 font-plus-jakarta-sans">
            Cari UMKM
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Nama UMKM atau pemilik..."
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10 h-11 font-plus-jakarta-sans"
              disabled={loading}
            />
            {search && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSearch("")}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                disabled={loading}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 font-plus-jakarta-sans">
            Kategori
          </label>
          <Select
            value={selectedCategory}
            onValueChange={onCategoryFilter}
            disabled={loading}
          >
            <SelectTrigger className="h-11">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-gray-400" />
                <SelectValue placeholder="Pilih kategori" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dusun Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 font-plus-jakarta-sans">
            Dusun
          </label>
          <Select
            value={selectedDusun}
            onValueChange={onDusunFilter}
            disabled={loading}
          >
            <SelectTrigger className="h-11">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <SelectValue placeholder="Pilih dusun" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Dusun</SelectItem>
              {dusunOptions.map((dusun) => (
                <SelectItem key={dusun} value={dusun}>
                  {dusun.replace("Dusun ", "")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 font-plus-jakarta-sans">
            Urutkan
          </label>
          <Select
            value={currentSortValue}
            onValueChange={(value) => {
              const option = sortOptions.find((opt) => opt.value === value);
              if (option) {
                onSort(option.field, option.order);
              }
            }}
            disabled={loading}
          >
            <SelectTrigger className="h-11">
              <div className="flex items-center gap-2">
                {currentSort.order === "ASC" ? (
                  <SortAsc className="h-4 w-4 text-gray-400" />
                ) : (
                  <SortDesc className="h-4 w-4 text-gray-400" />
                )}
                <SelectValue placeholder="Pilih urutan" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        <div className="space-y-2">
          <Button
            variant="outline"
            onClick={onResetFilters}
            disabled={loading || activeFiltersCount === 0}
            className="w-full h-11 flex items-center gap-2 font-plus-jakarta-sans"
          >
            <X className="h-4 w-4" />
            Reset Filter
          </Button>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <span className="text-sm font-medium text-gray-600 font-plus-jakarta-sans">
              Filter aktif:
            </span>
            <div className="flex flex-wrap gap-2">
              {search && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Pencarian: &ldquo;{search}&rdquo;
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSearch("")}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {selectedCategory !== "all" && selectedCategoryName && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Kategori: {selectedCategoryName}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCategoryFilter("all")}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {selectedDusun !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Dusun: {selectedDusun.replace("Dusun ", "")}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDusunFilter("all")}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
