"use client";

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
import { Calendar, Download, RefreshCw, X } from "lucide-react";
import { DatePickerWithRange } from "../ui/date-range-picker";
import { DateRange } from "react-day-picker";

interface StatisticsFiltersProps {
  timeRange: string;
  dateRange?: DateRange;
  onTimeRangeChange: (timeRange: string) => void;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
  onRefresh: () => void;
  onExport: () => void;
  loading?: boolean;
}

export function StatisticsFilters({
  timeRange,
  dateRange,
  onTimeRangeChange,
  onDateRangeChange,
  onRefresh,
  onExport,
  loading,
}: StatisticsFiltersProps) {
  const timeRangeOptions = [
    { value: "1d", label: "Hari Ini" },
    { value: "7d", label: "7 Hari Terakhir" },
    { value: "30d", label: "30 Hari Terakhir" },
    { value: "90d", label: "90 Hari Terakhir" },
    { value: "1y", label: "1 Tahun Terakhir" },
    { value: "custom", label: "Periode Kustom" },
  ];

  const clearFilters = () => {
    onTimeRangeChange("30d");
    onDateRangeChange(undefined);
  };

  const hasActiveFilters = timeRange !== "30d" || dateRange;

  return (
    <Card className="w-full">
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="space-y-4">
          {/* Main Filters Row */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Time Range Select */}
              <div className="w-full sm:w-48 lg:w-52">
                <Select value={timeRange} onValueChange={onTimeRangeChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih periode" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeRangeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Date Range Picker */}
              {timeRange === "custom" && (
                <div className="w-full sm:flex-1 lg:w-80">
                  <DatePickerWithRange
                    date={dateRange}
                    onDateChange={onDateRangeChange}
                    placeholder="Pilih rentang tanggal..."
                    className="w-full"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 sm:ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  disabled={loading}
                  className="flex items-center gap-2 flex-1 sm:flex-none"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="hidden xs:inline">
                    {loading ? "Memuat..." : "Refresh"}
                  </span>
                  <span className="xs:hidden">{loading ? "..." : "↻"}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExport}
                  disabled={loading}
                  className="flex items-center gap-2 flex-1 sm:flex-none"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden xs:inline">Export</span>
                  <span className="xs:hidden">↓</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-col gap-2">
              <span className="text-sm text-gray-600 font-medium">
                Filter Aktif:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {timeRange !== "30d" && (
                  <Badge variant="secondary" className="text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span className="truncate max-w-[120px]">
                      {
                        timeRangeOptions.find((opt) => opt.value === timeRange)
                          ?.label
                      }
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onTimeRangeChange("30d")}
                      className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}

                {dateRange && (
                  <Badge variant="secondary" className="text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span className="truncate max-w-[100px]">
                      Periode Kustom
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDateRangeChange(undefined)}
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
                  className="text-xs text-red-600 hover:text-red-700 h-6 px-2"
                >
                  Hapus Semua
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
