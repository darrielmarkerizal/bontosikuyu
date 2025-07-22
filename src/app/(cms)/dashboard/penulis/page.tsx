"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useDebounce } from "@/hooks/use-debounce";
import { WriterHeader } from "@/components/penulis/writer-header";
import { WriterStats } from "@/components/penulis/writer-stats";
import { WriterFilters } from "@/components/penulis/writer-filters";
import { WriterTable } from "@/components/penulis/writer-table";
import { WriterPagination } from "@/components/penulis/writer-pagination";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { useRouter } from "next/navigation";

import { Writer, WritersResponse } from "@/components/penulis/writer-types";

export default function PenulisPage() {
  // Data states
  const [writers, setWriters] = useState<Writer[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [overallStats, setOverallStats] = useState({
    totalWriters: 0,
    dusunCounts: {} as Record<string, number>,
  });
  const [dusunOptions, setDusunOptions] = useState<string[]>([]);

  // Filter states
  const [search, setSearch] = useState("");
  const [dusun, setDusun] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  // UI states
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingWriter, setDeletingWriter] = useState<Writer | null>(null);

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(search, 500);

  const router = useRouter();

  // Fetch writers data
  const fetchWriters = useCallback(async () => {
    try {
      setLoading(true);
      console.log("🔍 Fetching writers with params:", {
        page: pagination.currentPage,
        search: debouncedSearch,
        dusun,
        sortBy,
        sortOrder,
      });

      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.itemsPerPage.toString(),
        sortBy,
        sortOrder,
      });

      // Hanya tambahkan parameter jika ada nilai
      if (debouncedSearch && debouncedSearch.trim()) {
        params.append("search", debouncedSearch.trim());
      }
      if (dusun && dusun.trim() && dusun !== "all") {
        params.append("dusun", dusun.trim());
      }

      const response = await axios.get<WritersResponse>(
        `/api/writers?${params}`
      );

      if (response.data.success) {
        setWriters(response.data.data.writers);
        setPagination(response.data.data.pagination);
        setOverallStats(response.data.data.overallStats);
        setDusunOptions(response.data.data.filters.dusunOptions);

        console.log(
          "✅ Writers fetched successfully:",
          response.data.data.writers.length
        );
      } else {
        console.error("❌ Failed to fetch writers:", response.data.message);
        toast.error("Gagal memuat data penulis", {
          description: response.data.message,
        });
      }
    } catch (error) {
      console.error("💥 Error fetching writers:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          // No writers found - this is okay, show empty state
          setWriters([]);
          setPagination((prev) => ({
            ...prev,
            totalItems: 0,
            totalPages: 1,
            currentPage: 1,
            hasNextPage: false,
            hasPrevPage: false,
          }));

          // Jangan tampilkan error toast untuk 404 jika tidak ada filter aktif
          const hasActiveFilters =
            debouncedSearch || (dusun && dusun !== "all");
          if (hasActiveFilters) {
            console.log("ℹ️ No writers found with current filters");
          } else {
            console.log("ℹ️ No writers in database");
          }
        } else {
          toast.error("Gagal memuat data penulis", {
            description: error.response?.data?.message || error.message,
          });
        }
      } else {
        toast.error("Terjadi kesalahan", {
          description: "Gagal memuat data penulis",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [
    pagination.currentPage,
    pagination.itemsPerPage,
    debouncedSearch,
    dusun,
    sortBy,
    sortOrder,
  ]);

  // Effects
  useEffect(() => {
    fetchWriters();
  }, [fetchWriters]);

  // Reset to first page when filters change
  useEffect(() => {
    if (pagination.currentPage !== 1) {
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }
  }, [debouncedSearch, dusun, sortBy, sortOrder]);

  // Event handlers
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleSearch = (searchValue: string) => {
    setSearch(searchValue);
  };

  const handleDusunFilter = (dusunValue: string) => {
    // Normalize empty or "all" values to empty string
    const normalizedValue =
      !dusunValue || dusunValue === "all" ? "" : dusunValue;
    setDusun(normalizedValue);
  };

  const handleSort = (field: string, order: "ASC" | "DESC") => {
    setSortBy(field);
    setSortOrder(order);
  };

  const handleAddWriter = () => {
    router.push("/dashboard/penulis/tambah");
  };

  const handleDeleteWriter = (writer: Writer) => {
    setDeletingWriter(writer);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingWriter) return;

    try {
      console.log("🗑️ Deleting writer:", deletingWriter.id);

      const response = await axios.delete(`/api/writers/${deletingWriter.id}`);

      if (response.data.success) {
        toast.success("Penulis berhasil dihapus", {
          description: `${deletingWriter.fullName} telah dihapus`,
        });

        // Refresh data
        await fetchWriters();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("💥 Error deleting writer:", error);

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error("Gagal menghapus penulis", {
          description: errorMessage,
        });
      } else {
        toast.error("Terjadi kesalahan", {
          description: "Gagal menghapus penulis",
        });
      }
    } finally {
      setShowDeleteDialog(false);
      setDeletingWriter(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <WriterHeader onAddClick={handleAddWriter} />

      {/* Stats */}
      <WriterStats
        totalWriters={overallStats.totalWriters}
        dusunCounts={overallStats.dusunCounts}
      />

      {/* Filters */}
      <WriterFilters
        search={search}
        dusun={dusun}
        dusunOptions={dusunOptions}
        onSearch={handleSearch}
        onDusunFilter={handleDusunFilter}
        onSort={handleSort}
        currentSort={{ field: sortBy, order: sortOrder }}
      />

      {/* Table */}
      <WriterTable
        writers={writers}
        loading={loading}
        onEdit={() => {}}
        onDelete={handleDeleteWriter}
      />

      {/* Pagination */}
      {pagination.totalItems > 0 && (
        <WriterPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          hasNextPage={pagination.hasNextPage}
          hasPrevPage={pagination.hasPrevPage}
          onPageChange={handlePageChange}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Penulis"
        description={`Apakah Anda yakin ingin menghapus penulis "${deletingWriter?.fullName}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Penulis"
      />
    </div>
  );
}
