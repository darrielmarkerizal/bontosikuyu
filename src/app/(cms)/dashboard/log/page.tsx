"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { LogsHeader } from "@/components/logs/logs-header";
import { LogsStats } from "@/components/logs/logs-stats";
import { LogsFilters } from "@/components/logs/logs-filter";
import { LogsTable } from "@/components/logs/logs-table";
import { LogsPagination } from "@/components/logs/logs-pagination";
import { Log, LogsResponse } from "@/components/logs/logs-types";

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [actionOptions, setActionOptions] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");
  const [loading, setLoading] = useState(true);

  // Stats state
  const [stats, setStats] = useState({
    totalLogs: 0,
    actionCounts: {} as Record<string, number>,
    recentActivity: {
      today: 0,
      yesterday: 0,
      thisWeek: 0,
    },
  });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.itemsPerPage.toString(),
      });
      if (search) params.append("search", search);
      if (action) params.append("action", action);

      const res = await axios.get<LogsResponse>(`/api/logs?${params}`);
      if (res.data.success) {
        setLogs(res.data.data.logs);
        setPagination(res.data.data.pagination);
        setActionOptions(res.data.data.filters.actionOptions);

        // Calculate stats from logs data
        const actionCounts: Record<string, number> = {};
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        let todayCount = 0;
        let yesterdayCount = 0;
        let thisWeekCount = 0;

        res.data.data.logs.forEach((log) => {
          // Count actions
          actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;

          // Count recent activity
          const logDate = new Date(log.createdAt);
          if (logDate >= today) {
            todayCount++;
          } else if (logDate >= yesterday) {
            yesterdayCount++;
          }
          if (logDate >= weekAgo) {
            thisWeekCount++;
          }
        });

        setStats({
          totalLogs: res.data.data.pagination.totalItems,
          actionCounts,
          recentActivity: {
            today: todayCount,
            yesterday: yesterdayCount,
            thisWeek: thisWeekCount,
          },
        });
      } else {
        toast.error("Gagal memuat data log", { description: res.data.message });
      }
    } catch {
      toast.error("Gagal memuat data log");
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.itemsPerPage, search, action]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleRefresh = () => {
    fetchLogs();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <LogsHeader onRefresh={handleRefresh} loading={loading} />

      {/* Stats */}
      <LogsStats
        totalLogs={stats.totalLogs}
        actionCounts={stats.actionCounts}
        recentActivity={stats.recentActivity}
      />

      {/* Filters */}
      <LogsFilters
        search={search}
        action={action}
        actionOptions={actionOptions}
        onSearch={setSearch}
        onActionFilter={setAction}
      />

      {/* Table */}
      <LogsTable logs={logs} loading={loading} />

      {/* Pagination */}
      {pagination.totalItems > 0 && (
        <LogsPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          hasNextPage={pagination.hasNextPage}
          hasPrevPage={pagination.hasPrevPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
