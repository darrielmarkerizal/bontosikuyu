"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { LogsHeader } from "@/components/logs/logs-header";
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

  return (
    <div className="space-y-6">
      <LogsHeader />
      <LogsFilters
        search={search}
        action={action}
        actionOptions={actionOptions}
        onSearch={setSearch}
        onActionFilter={setAction}
      />
      <LogsTable logs={logs} loading={loading} />
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
