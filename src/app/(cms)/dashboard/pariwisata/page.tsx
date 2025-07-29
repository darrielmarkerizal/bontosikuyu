"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useDebounce } from "@/hooks/use-debounce";
import { TravelHeader } from "@/components/travel/travel-header";
import { TravelStats } from "@/components/travel/travel-stats";
import { TravelFilters } from "@/components/travel/travel-filters";
import { TravelTable } from "@/components/travel/travel-table";
import { TravelForm } from "@/components/travel/travel-form";
import { TravelPagination } from "@/components/travel/travel-pagination";
import { TravelSkeleton } from "@/components/travel/travel-skeleton";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";

interface Travel {
  id: number;
  name: string;
  dusun: string;
  image: string | null;
  category: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: number;
  name: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface TravelsResponse {
  success: boolean;
  message: string;
  data: {
    travels: Travel[];
    pagination: Pagination;
    filters: {
      categories: Category[];
      dusunOptions: string[];
    };
    overallStats: {
      totalTravels: number;
      dusunCounts: Record<string, number>;
      categoryCounts: Record<string, number>;
    };
  };
}

// Add type for form data
type TravelFormData = {
  name: string;
  dusun: string;
  image: string | null;
  travelCategoryId: number;
};

export default function PariwisataPage() {
  // States
  const [travels, setTravels] = useState<Travel[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dusunOptions, setDusunOptions] = useState<string[]>([]);
  const [overallStats, setOverallStats] = useState({
    totalTravels: 0,
    dusunCounts: {} as Record<string, number>,
    categoryCounts: {} as Record<string, number>,
  });
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDusun, setSelectedDusun] = useState<string>("all");
  const [currentSort, setCurrentSort] = useState({
    field: "createdAt",
    order: "DESC" as "ASC" | "DESC",
  });

  // UI States
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTravel, setEditingTravel] = useState<Travel | null>(null);
  const [deletingTravel, setDeletingTravel] = useState<Travel | null>(null);

  // Hooks
  const debouncedSearch = useDebounce(search, 500);

  // Fetch travels data
  const fetchTravels = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.itemsPerPage.toString(),
        sortBy: currentSort.field,
        sortOrder: currentSort.order,
      });

      if (debouncedSearch?.trim()) {
        params.append("search", debouncedSearch.trim());
      }
      if (selectedCategory !== "all") {
        params.append("categoryId", selectedCategory);
      }
      if (selectedDusun !== "all") {
        params.append("dusun", selectedDusun);
      }

      const response = await axios.get<TravelsResponse>(
        `/api/travels?${params}`
      );

      if (response.data.success) {
        setTravels(response.data.data.travels);
        setPagination(response.data.data.pagination);
        setCategories(response.data.data.filters.categories);
        setDusunOptions(response.data.data.filters.dusunOptions);
        setOverallStats(response.data.data.overallStats);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching travels:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setTravels([]);
          setPagination((prev) => ({
            ...prev,
            totalItems: 0,
            totalPages: 1,
            currentPage: 1,
            hasNextPage: false,
            hasPrevPage: false,
          }));
        } else {
          const errorMessage = error.response?.data?.message || error.message;
          toast.error("Gagal memuat data pariwisata", {
            description: errorMessage,
          });
        }
      } else {
        const errorMessage = "Terjadi kesalahan yang tidak terduga";
        toast.error("Terjadi kesalahan", {
          description: errorMessage,
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
    currentSort,
  ]);

  // Effects
  useEffect(() => {
    fetchTravels();
  }, [fetchTravels]);

  // Reset to first page when filters change
  useEffect(() => {
    if (pagination.currentPage !== 1) {
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }
  }, [
    debouncedSearch,
    selectedCategory,
    selectedDusun,
    currentSort,
    pagination.currentPage,
  ]);

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
    setCurrentSort({ field, order });
  };

  const handleAdd = () => {
    setEditingTravel(null);
    setShowForm(true);
  };

  const handleEdit = (travel: Travel) => {
    setEditingTravel(travel);
    setShowForm(true);
  };

  const handleDelete = (travel: Travel) => {
    setDeletingTravel(travel);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTravel) return;

    try {
      await axios.delete(`/api/travels/${deletingTravel.id}`);
      toast.success("Destinasi wisata berhasil dihapus");
      fetchTravels();
      setDeletingTravel(null);
    } catch (error) {
      console.error("Error deleting travel:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error("Gagal menghapus destinasi wisata", {
          description: errorMessage,
        });
      } else {
        toast.error("Terjadi kesalahan", {
          description: "Gagal menghapus destinasi wisata",
        });
      }
    }
  };

  const handleFormSubmit = async (formData: TravelFormData) => {
    try {
      if (editingTravel) {
        await axios.put(`/api/travels/${editingTravel.id}`, formData);
        toast.success("Destinasi wisata berhasil diperbarui");
      } else {
        await axios.post("/api/travels", formData);
        toast.success("Destinasi wisata berhasil ditambahkan");
      }
      setShowForm(false);
      setEditingTravel(null);
      fetchTravels();
    } catch (error) {
      console.error("Error saving travel:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error("Gagal menyimpan destinasi wisata", {
          description: errorMessage,
        });
      } else {
        toast.error("Terjadi kesalahan", {
          description: "Gagal menyimpan destinasi wisata",
        });
      }
    }
  };

  const handleRefresh = () => {
    fetchTravels();
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    toast.info("Fitur ekspor akan segera tersedia");
  };

  const handleFilter = () => {
    // TODO: Implement advanced filter functionality
    toast.info("Fitur filter lanjutan akan segera tersedia");
  };

  if (loading) {
    return <TravelSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <TravelHeader
        onAdd={handleAdd}
        onRefresh={handleRefresh}
        onExport={handleExport}
        onFilter={handleFilter}
      />

      {/* Stats */}
      <TravelStats stats={overallStats} />

      {/* Filters */}
      <TravelFilters
        search={search}
        selectedCategory={selectedCategory}
        selectedDusun={selectedDusun}
        categories={categories}
        dusunOptions={dusunOptions}
        onSearch={handleSearch}
        onCategoryFilter={handleCategoryFilter}
        onDusunFilter={handleDusunFilter}
        onSort={handleSort}
        currentSort={currentSort}
      />

      {/* Table */}
      <TravelTable
        travels={travels}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <TravelPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          hasNextPage={pagination.hasNextPage}
          hasPrevPage={pagination.hasPrevPage}
          onPageChange={handlePageChange}
        />
      )}

      {/* Form Modal */}
      <TravelForm
        open={showForm}
        travel={editingTravel}
        categories={categories}
        onClose={() => {
          setShowForm(false);
          setEditingTravel(null);
        }}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        isOpen={!!deletingTravel}
        title="Hapus Destinasi Wisata"
        description={`Apakah Anda yakin ingin menghapus destinasi wisata "${deletingTravel?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingTravel(null)}
      />
    </div>
  );
}
