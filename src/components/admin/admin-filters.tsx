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

interface AdminFiltersProps {
  search: string;
  onSearch: (search: string) => void;
  onSort: (field: string, order: "ASC" | "DESC") => void;
  currentSort: { field: string; order: "ASC" | "DESC" };
}

export function AdminFilters({
  search,
  onSearch,
  onSort,
  currentSort,
}: AdminFiltersProps) {
  const clearFilters = () => {
    onSearch("");
  };

  const handleSortChange = (value: string) => {
    const [field, order] = value.split("-");
    onSort(field, order as "ASC" | "DESC");
  };

  const getCurrentSortValue = () => {
    return `${currentSort.field}-${currentSort.order}`;
  };

  const hasActiveFilters = search;

  const sortOptions = [
    { value: "createdAt-DESC", label: "Terbaru" },
    { value: "createdAt-ASC", label: "Terlama" },
    { value: "fullName-ASC", label: "Nama A-Z" },
    { value: "fullName-DESC", label: "Nama Z-A" },
    { value: "username-ASC", label: "Username A-Z" },
    { value: "username-DESC", label: "Username Z-A" },
  ];

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
                  placeholder="Cari admin berdasarkan nama, email, atau username..."
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

            {/* Sort Select */}
            <div className="w-full lg:w-48">
              <Select
                value={getCurrentSortValue()}
                onValueChange={handleSortChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Urutkan" />
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
