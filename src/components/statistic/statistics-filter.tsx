// filepath: /Users/darrielmarkerizal/Coding/laiyolobaru/src/components/statistic/statistics-filter.tsx
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
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Main Filters Row */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Time Range Select */}
            <div className="w-full lg:w-48">
              <Select value={timeRange} onValueChange={onTimeRangeChange}>
                <SelectTrigger>
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
              <div className="w-full lg:w-80">
                <DatePickerWithRange
                  date={dateRange}
                  onDateChange={onDateRangeChange}
                  placeholder="Pilih rentang tanggal..."
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Filter Aktif:</span>

              {timeRange !== "30d" && (
                <Badge variant="secondary" className="text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  {
                    timeRangeOptions.find((opt) => opt.value === timeRange)
                      ?.label
                  }
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
                  Periode Kustom
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
