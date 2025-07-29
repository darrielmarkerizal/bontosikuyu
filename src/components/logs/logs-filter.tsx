import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";

interface LogsFiltersProps {
  search: string;
  action: string;
  actionOptions: string[];
  onSearch: (value: string) => void;
  onActionFilter: (value: string) => void;
}

// Action labels in Indonesian
const actionLabels: { [key: string]: string } = {
  CREATE: "Pembuatan Data Baru",
  UPDATE: "Pembaruan Data",
  DELETE: "Penghapusan Data",
  LOGIN: "Masuk Sistem",
  LOGOUT: "Keluar Sistem",
  VIEW: "Melihat Data",
  DOWNLOAD: "Mengunduh Data",
  UPLOAD: "Mengunggah Data",
  all: "Semua Aksi",
};

export function LogsFilters({
  search,
  action,
  actionOptions,
  onSearch,
  onActionFilter,
}: LogsFiltersProps) {
  const hasActiveFilters = search || action;

  const clearFilters = () => {
    onSearch("");
    onActionFilter("");
  };

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari log berdasarkan deskripsi, user ID, atau IP..."
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Action Filter */}
          <div className="w-full sm:w-48">
            <Select value={action} onValueChange={onActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Aksi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{actionLabels["all"]}</SelectItem>
                {actionOptions.map((actionOption) => (
                  <SelectItem key={actionOption} value={actionOption}>
                    {actionLabels[actionOption] || actionOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="w-full sm:w-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Bersihkan Filter
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              Filter Aktif:
            </div>
            {search && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Pencarian: &quot;{search}&quot;
              </span>
            )}
            {action && action !== "all" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Aksi: {actionLabels[action] || action}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
