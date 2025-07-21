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

interface WriterFiltersProps {
  search: string;
  dusun: string;
  dusunOptions: string[];
  onSearch: (search: string) => void;
  onDusunFilter: (dusun: string) => void;
  onSort: (field: string, order: "ASC" | "DESC") => void;
  currentSort: { field: string; order: "ASC" | "DESC" };
}

export function WriterFilters({
  search,
  dusun,
  dusunOptions,
  onSearch,
  onDusunFilter,
  onSort,
  currentSort,
}: WriterFiltersProps) {
  const handleSort = (field: string) => {
    const newOrder =
      currentSort.field === field && currentSort.order === "ASC"
        ? "DESC"
        : "ASC";
    onSort(field, newOrder);
  };

  const clearFilters = () => {
    onSearch("");
    onDusunFilter(""); // Perbaikan: ganti dari "all" ke ""
  };

  const hasActiveFilters = search || (dusun && dusun !== "all");

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
                  placeholder="Cari penulis berdasarkan nama atau nomor telepon..."
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

            {/* Dusun Filter */}
            <div className="w-full lg:w-48">
              <Select
                value={dusun || "all"}
                onValueChange={(value) =>
                  onDusunFilter(value === "all" ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter Dusun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Dusun</SelectItem>
                  {dusunOptions.map((dusunOption) => (
                    <SelectItem key={dusunOption} value={dusunOption}>
                      {dusunOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSort("fullName")}
                className={`${
                  currentSort.field === "fullName"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "hover:bg-gray-100"
                }`}
              >
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Nama
                {currentSort.field === "fullName" && (
                  <span className="ml-1 text-xs">
                    {currentSort.order === "ASC" ? "↑" : "↓"}
                  </span>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSort("createdAt")}
                className={`${
                  currentSort.field === "createdAt"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "hover:bg-gray-100"
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

              {dusun && dusun !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Dusun: {dusun}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDusunFilter("")} // Perbaikan: ganti dari "all" ke ""
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
