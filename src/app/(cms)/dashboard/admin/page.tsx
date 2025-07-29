"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useDebounce } from "@/hooks/use-debounce";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminStats } from "@/components/admin/admin-stats";
import { AdminFilters } from "@/components/admin/admin-filters";
import { AdminTable } from "@/components/admin/admin-table";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminSkeleton } from "@/components/admin/admin-skeleton";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import {
  Admin,
  AdminsResponse,
  AdminFormData,
  UpdateAdminRequest,
} from "@/components/admin/admin-types";

export default function AdminPage() {
  // Data states
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [overallStats, setOverallStats] = useState({
    totalUsers: 0,
  });

  // Filter states
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  // UI states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingAdmin, setDeletingAdmin] = useState<Admin | null>(null);

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(search, 500);

  // Fetch admins data
  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      console.log("🔍 Fetching admins with params:", {
        page: pagination.currentPage,
        search: debouncedSearch,
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

      const response = await axios.get<AdminsResponse>(`/api/admins?${params}`);

      if (response.data.success) {
        setAdmins(response.data.data.users);
        setPagination(response.data.data.pagination);
        setOverallStats(response.data.data.overallStats);

        console.log(
          "✅ Admins fetched successfully:",
          response.data.data.users.length
        );
      } else {
        console.error("❌ Failed to fetch admins:", response.data.message);
        toast.error("Gagal memuat data admin", {
          description: response.data.message,
        });
      }
    } catch (error) {
      console.error("💥 Error fetching admins:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          // No admins found - this is okay, show empty state
          setAdmins([]);
          setPagination((prev) => ({
            ...prev,
            totalItems: 0,
            totalPages: 1,
            currentPage: 1,
            hasNextPage: false,
            hasPrevPage: false,
          }));

          // Jangan tampilkan error toast untuk 404 jika tidak ada filter aktif
          const hasActiveFilters = debouncedSearch;
          if (hasActiveFilters) {
            console.log("ℹ️ No admins found with current filters");
          } else {
            console.log("ℹ️ No admins in database");
          }
        } else {
          toast.error("Gagal memuat data admin", {
            description: error.response?.data?.message || error.message,
          });
        }
      } else {
        toast.error("Terjadi kesalahan", {
          description: "Gagal memuat data admin",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [
    pagination.currentPage,
    pagination.itemsPerPage,
    debouncedSearch,
    sortBy,
    sortOrder,
  ]);

  // Effects
  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // FIX: Reset to first page when filters change - Remove pagination.currentPage dependency
  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [debouncedSearch, sortBy, sortOrder]);

  // Event handlers
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleSearch = (searchValue: string) => {
    setSearch(searchValue);
  };

  const handleSort = (field: string, order: "ASC" | "DESC") => {
    setSortBy(field);
    setSortOrder(order);
  };

  const handleAddAdmin = () => {
    setEditingAdmin(null);
    setShowForm(true);
  };

  const handleEditAdmin = (admin: Admin) => {
    setEditingAdmin(admin);
    setShowForm(true);
  };

  const handleDeleteAdmin = (admin: Admin) => {
    setDeletingAdmin(admin);
    setShowDeleteDialog(true);
  };

  const handleFormSubmit = async (data: AdminFormData) => {
    try {
      setSubmitting(true);

      console.log("=== FORM SUBMIT DEBUG ===");
      console.log("Form data received:", {
        fullName: data.fullName,
        email: data.email,
        username: data.username,
        password: data.password ? "PROVIDED" : "MISSING",
        confirmPassword: data.confirmPassword ? "PROVIDED" : "MISSING",
        isEditing: !!editingAdmin,
      });

      if (editingAdmin) {
        // Update existing admin
        console.log("✏️ Updating admin:", editingAdmin.id);

        // FIX: Replace 'any' with proper type
        const updatePayload: UpdateAdminRequest = {
          fullName: data.fullName,
          email: data.email,
          username: data.username,
        };

        // Only include password fields if password is being changed
        if (data.password && data.password.trim() !== "") {
          updatePayload.password = data.password;
          updatePayload.confirmPassword = data.confirmPassword;
          updatePayload.currentPassword = data.currentPassword;
        }

        const response = await axios.put(
          `/api/admins/${editingAdmin.id}`,
          updatePayload
        );

        if (response.data.success) {
          toast.success("Admin berhasil diperbarui", {
            description: `${data.fullName} telah diperbarui`,
          });

          // Refresh data
          await fetchAdmins();
          setShowForm(false);
          setEditingAdmin(null);
        } else {
          throw new Error(response.data.message);
        }
      } else {
        // Create new admin using register endpoint
        console.log("➕ Creating new admin");

        // Validate required fields for new admin
        if (
          !data.fullName ||
          !data.email ||
          !data.username ||
          !data.password ||
          !data.confirmPassword
        ) {
          toast.error("Semua field wajib diisi");
          return;
        }

        if (data.password !== data.confirmPassword) {
          toast.error("Konfirmasi password tidak cocok");
          return;
        }

        const createPayload = {
          fullName: data.fullName.trim(),
          email: data.email.trim(),
          username: data.username.trim(),
          password: data.password,
          confirmPassword: data.confirmPassword, // PENTING: Kirim confirmPassword
        };

        console.log("Sending create payload:", {
          ...createPayload,
          password: "[HIDDEN]",
          confirmPassword: "[HIDDEN]",
        });

        const response = await axios.post("/api/register", createPayload);

        if (response.data.success) {
          toast.success("Admin berhasil ditambahkan", {
            description: `${data.fullName} telah ditambahkan`,
          });

          // Refresh data
          await fetchAdmins();
          setShowForm(false);
        } else {
          throw new Error(response.data.message);
        }
      }
    } catch (error) {
      console.error("💥 Error saving admin:", error);

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error("Gagal menyimpan admin", {
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
          description: "Gagal menyimpan admin",
        });
      }
      throw error; // Re-throw to prevent form from closing
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingAdmin) return;

    try {
      console.log("🗑️ Deleting admin:", deletingAdmin.id);

      const response = await axios.delete(`/api/admins/${deletingAdmin.id}`);

      if (response.data.success) {
        toast.success("Admin berhasil dihapus", {
          description: `${deletingAdmin.fullName} telah dihapus`,
        });

        // Refresh data
        await fetchAdmins();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("💥 Error deleting admin:", error);

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error("Gagal menghapus admin", {
          description: errorMessage,
        });
      } else {
        toast.error("Terjadi kesalahan", {
          description: "Gagal menghapus admin",
        });
      }
    } finally {
      setShowDeleteDialog(false);
      setDeletingAdmin(null);
    }
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <AdminSkeleton />
      ) : (
        <>
          {/* Header */}
          <AdminHeader onAddClick={handleAddAdmin} />

          {/* Stats */}
          <AdminStats totalAdmins={overallStats.totalUsers} />

          {/* Filters */}
          <AdminFilters
            search={search}
            onSearch={handleSearch}
            onSort={handleSort}
            currentSort={{ field: sortBy, order: sortOrder }}
          />

          {/* Table */}
          <AdminTable
            admins={admins}
            loading={loading}
            onEdit={handleEditAdmin}
            onDelete={handleDeleteAdmin}
          />

          {/* Pagination */}
          {pagination.totalItems > 0 && (
            <AdminPagination
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
      <AdminForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingAdmin(null);
        }}
        onSubmit={handleFormSubmit}
        admin={editingAdmin}
        loading={submitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setDeletingAdmin(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Hapus Admin"
        description={`Apakah Anda yakin ingin menghapus admin "${deletingAdmin?.fullName}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Admin"
      />
    </div>
  );
}
