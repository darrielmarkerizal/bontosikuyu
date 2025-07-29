"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useDebounce } from "@/hooks/use-debounce";
import { UmkmHeader } from "@/components/umkm/umkm-header";
import { UmkmStats } from "@/components/umkm/umkm-stats";
import { UmkmFilters } from "@/components/umkm/umkm-filters";
import { UmkmTable } from "@/components/umkm/umkm-table";
import { UmkmForm } from "@/components/umkm/umkm-form";
import { UmkmPagination } from "@/components/umkm/umkm-pagination";
import { UmkmSkeleton } from "@/components/umkm/umkm-skeleton";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import {
  Umkm,
  UmkmResponse,
  UmkmFormData,
  UpdateUmkmRequest,
} from "@/components/umkm/umkm-types";

export default function UmkmPage() {
  // Data states
  const [umkmList, setUmkmList] = useState<Umkm[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [overallStats, setOverallStats] = useState({
    totalUmkm: 0,
    dusunCounts: {} as Record<string, number>,
  });

  // Filter states
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDusun, setSelectedDusun] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  // UI states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUmkm, setEditingUmkm] = useState<Umkm | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingUmkm, setDeletingUmkm] = useState<Umkm | null>(null);

  // Data states
  const [categories, setCategories] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [dusunOptions, setDusunOptions] = useState<string[]>([]);

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(search, 500);

  // Fetch UMKM data
  const fetchUmkm = useCallback(async () => {
    try {
      setLoading(true);
      console.log(" Fetching UMKM with params:", {
        page: pagination.currentPage,
        search: debouncedSearch,
        categoryId: selectedCategory,
        dusun: selectedDusun,
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
      if (selectedCategory !== "all") {
        params.append("categoryId", selectedCategory);
      }
      if (selectedDusun !== "all") {
        params.append("dusun", selectedDusun);
      }

      const response = await axios.get<UmkmResponse>(`/api/umkm?${params}`);

      if (response.data.success) {
        setUmkmList(response.data.data.umkm);
        setPagination(response.data.data.pagination);
        setOverallStats(response.data.data.overallStats);
        setCategories(response.data.data.filters.categories);
        setDusunOptions(response.data.data.filters.dusunOptions);

        console.log(
          "✅ UMKM fetched successfully:",
          response.data.data.umkm.length
        );
      } else {
        console.error("❌ Failed to fetch UMKM:", response.data.message);
        toast.error("Gagal memuat data UMKM", {
          description: response.data.message,
        });
      }
    } catch (error) {
      console.error("💥 Error fetching UMKM:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          // No UMKM found - this is okay, show empty state
          setUmkmList([]);
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
            debouncedSearch ||
            selectedCategory !== "all" ||
            selectedDusun !== "all";
          if (hasActiveFilters) {
            console.log("ℹ️ No UMKM found with current filters");
          } else {
            console.log("ℹ️ No UMKM in database");
          }
        } else {
          toast.error("Gagal memuat data UMKM", {
            description: error.response?.data?.message || error.message,
          });
        }
      } else {
        toast.error("Terjadi kesalahan", {
          description: "Gagal memuat data UMKM",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [
    pagination.currentPage,
    pagination.itemsPerPage,
    debouncedSearch,
    selectedCategory,
    selectedDusun,
    sortBy,
    sortOrder,
  ]);

  // Effects
  useEffect(() => {
    fetchUmkm();
  }, [fetchUmkm]);

  // FIX: Reset to first page when filters change - Remove pagination.currentPage dependency
  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [debouncedSearch, selectedCategory, selectedDusun, sortBy, sortOrder]);

  // Event handlers
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleSearch = (searchValue: string) => {
    setSearch(searchValue);
  };

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleDusunFilter = (dusun: string) => {
    setSelectedDusun(dusun);
  };

  const handleSort = (field: string, order: "ASC" | "DESC") => {
    setSortBy(field);
    setSortOrder(order);
  };

  const handleAddUmkm = () => {
    setEditingUmkm(null);
    setShowForm(true);
  };

  const handleEditUmkm = (umkm: Umkm) => {
    setEditingUmkm(umkm);
    setShowForm(true);
  };

  const handleDeleteUmkm = (umkm: Umkm) => {
    setDeletingUmkm(umkm);
    setShowDeleteDialog(true);
  };

  const handleFormSubmit = async (data: UmkmFormData) => {
    try {
      setSubmitting(true);

      console.log("=== FORM SUBMIT DEBUG ===");
      console.log("Form data received:", {
        umkmName: data.umkmName,
        ownerName: data.ownerName,
        umkmCategoryId: data.umkmCategoryId,
        dusun: data.dusun,
        phone: data.phone,
        image: data.image,
        isEditing: !!editingUmkm,
      });

      if (editingUmkm) {
        // Update existing UMKM
        console.log("✏️ Updating UMKM:", editingUmkm.id);

        const updatePayload: UpdateUmkmRequest = {
          umkmName: data.umkmName,
          ownerName: data.ownerName,
          umkmCategoryId: data.umkmCategoryId,
          dusun: data.dusun,
          phone: data.phone,
          image: data.image,
        };

        const response = await axios.put(
          `/api/umkm/${editingUmkm.id}`,
          updatePayload
        );

        if (response.data.success) {
          toast.success("UMKM berhasil diperbarui", {
            description: `${data.umkmName} telah diperbarui`,
          });

          // Refresh data
          await fetchUmkm();
          setShowForm(false);
          setEditingUmkm(null);
        } else {
          throw new Error(response.data.message);
        }
      } else {
        // Create new UMKM
        console.log("➕ Creating new UMKM");

        const createPayload = {
          umkmName: data.umkmName.trim(),
          ownerName: data.ownerName.trim(),
          umkmCategoryId: data.umkmCategoryId,
          dusun: data.dusun,
          phone: data.phone.trim(),
          image: data.image,
        };

        console.log("Sending create payload:", createPayload);

        const response = await axios.post("/api/umkm", createPayload);

        if (response.data.success) {
          toast.success("UMKM berhasil ditambahkan", {
            description: `${data.umkmName} telah ditambahkan`,
          });

          // Refresh data
          await fetchUmkm();
          setShowForm(false);
        } else {
          throw new Error(response.data.message);
        }
      }
    } catch (error) {
      console.error("💥 Error saving UMKM:", error);

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error("Gagal menyimpan UMKM", {
          description: errorMessage,
        });

        // Log detailed error for debugging
        console.log("Error details:", {
          status: error.response?.status,
          data: error.response?.data,
          requestData: error.config?.data,
        });
      } else {
        toast.error("Terjadi kesalahan", {
          description: "Gagal menyimpan UMKM",
        });
      }
      throw error; // Re-throw to prevent form from closing
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingUmkm) return;

    try {
      console.log("🗑️ Deleting UMKM:", deletingUmkm.id);

      const response = await axios.delete(`/api/umkm/${deletingUmkm.id}`);

      if (response.data.success) {
        toast.success("UMKM berhasil dihapus", {
          description: `${deletingUmkm.umkmName} telah dihapus`,
        });

        // Refresh data
        await fetchUmkm();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("💥 Error deleting UMKM:", error);

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error("Gagal menghapus UMKM", {
          description: errorMessage,
        });
      } else {
        toast.error("Terjadi kesalahan", {
          description: "Gagal menghapus UMKM",
        });
      }
    } finally {
      setShowDeleteDialog(false);
      setDeletingUmkm(null);
    }
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <UmkmSkeleton />
      ) : (
        <>
          {/* Header */}
          <UmkmHeader onAddClick={handleAddUmkm} />

          {/* Stats */}
          <UmkmStats
            totalUmkm={overallStats.totalUmkm}
            dusunCounts={overallStats.dusunCounts}
          />

          {/* Filters */}
          <UmkmFilters
            search={search}
            selectedCategory={selectedCategory}
            selectedDusun={selectedDusun}
            categories={categories}
            dusunOptions={dusunOptions}
            onSearch={handleSearch}
            onCategoryFilter={handleCategoryFilter}
            onDusunFilter={handleDusunFilter}
            onSort={handleSort}
            currentSort={{ field: sortBy, order: sortOrder }}
            loading={loading}
          />

          {/* Table */}
          <UmkmTable
            umkmList={umkmList}
            loading={loading}
            onEdit={handleEditUmkm}
            onDelete={handleDeleteUmkm}
          />

          {/* Pagination */}
          {pagination.totalItems > 0 && (
            <UmkmPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {/* Form Dialog */}
      <UmkmForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingUmkm(null);
        }}
        onSubmit={handleFormSubmit}
        umkm={editingUmkm}
        loading={submitting}
        categories={categories}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setDeletingUmkm(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Hapus UMKM"
        description={`Apakah Anda yakin ingin menghapus UMKM "${deletingUmkm?.umkmName}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus UMKM"
      />
    </div>
  );
}
