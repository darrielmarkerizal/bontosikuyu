"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import UmkmBanner from "./umkm-banner";
import { UmkmFilters } from "./umkm-filters";
import UmkmGrid from "./umkm-grid";
import { UmkmPagination } from "./umkm-pagination";
import { useDebounce } from "@/hooks/use-debounce";

interface Umkm {
  id: number;
  umkmName: string;
  ownerName: string;
  dusun: string;
  phone: string;
  image?: string;
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

interface UmkmResponse {
  success: boolean;
  message: string;
  data: {
    umkm: Umkm[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    filters: {
      categories: Category[];
      dusunOptions: string[];
      dusunCounts: Record<string, number>;
    };
    overallStats: {
      totalUmkm: number;
      dusunCounts: Record<string, number>;
    };
  };
}

export default function UmkmPageContent() {
  // State management
  const [umkmList, setUmkmList] = useState<Umkm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDusun, setSelectedDusun] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  // Data states
  const [categories, setCategories] = useState<Category[]>([]);
  const [dusunOptions, setDusunOptions] = useState<string[]>([]);
  const [overallStats, setOverallStats] = useState({
    totalUmkm: 0,
    dusunCounts: {} as Record<string, number>,
  });

  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Debounced search
  const debouncedSearch = useDebounce(search, 500);

  // Fetch UMKM data
  const fetchUmkm = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.itemsPerPage.toString(),
        sortBy,
        sortOrder,
      });

      if (debouncedSearch) params.append("search", debouncedSearch);
      if (selectedCategory !== "all")
        params.append("categoryId", selectedCategory);
      if (selectedDusun !== "all") params.append("dusun", selectedDusun);

      const response = await axios.get<UmkmResponse>(`/api/umkm?${params}`);

      if (response.data.success) {
        setUmkmList(response.data.data.umkm);
        setPagination({
          currentPage: response.data.data.pagination.currentPage,
          totalPages: response.data.data.pagination.totalPages,
          totalItems: response.data.data.pagination.totalItems,
          itemsPerPage: response.data.data.pagination.itemsPerPage,
          hasNextPage: response.data.data.pagination.hasNextPage,
          hasPrevPage: response.data.data.pagination.hasPrevPage,
        });
        setCategories(response.data.data.filters.categories);
        setDusunOptions(response.data.data.filters.dusunOptions);
        setOverallStats(response.data.data.overallStats);
      }
    } catch (error) {
      console.error("Error fetching UMKM:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          // No data found - not an error, just empty results
          setUmkmList([]);
          setPagination((prev) => ({ ...prev, totalItems: 0, totalPages: 0 }));
        } else {
          const errorMessage =
            error.response?.data?.message || "Gagal memuat data UMKM";
          setError(errorMessage);
          toast.error("Gagal memuat data", {
            description: errorMessage,
          });
        }
      } else {
        setError("Terjadi kesalahan yang tidak terduga");
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

  // Reset to first page when filters change
  useEffect(() => {
    if (pagination.currentPage !== 1) {
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }
  }, [
    debouncedSearch,
    selectedCategory,
    selectedDusun,
    sortBy,
    sortOrder,
    pagination.currentPage,
  ]);

  // Event handlers
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedDusun("all");
    setSortBy("createdAt");
    setSortOrder("DESC");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Banner */}
      <UmkmBanner
        totalUmkm={overallStats.totalUmkm}
        dusunCounts={overallStats.dusunCounts}
        categories={categories}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
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
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Results Info */}
            <div className="flex items-center justify-between">
              <div className="text-gray-600 font-plus-jakarta-sans">
                {loading ? (
                  <div className="h-5 w-32 bg-gray-200 rounded"></div>
                ) : (
                  <span>
                    Menampilkan {umkmList.length} dari {pagination.totalItems}{" "}
                    UMKM
                  </span>
                )}
              </div>
            </div>

            {/* UMKM Grid */}
            <UmkmGrid
              umkmList={umkmList}
              loading={loading}
              error={error}
              hasActiveFilters={
                debouncedSearch !== "" ||
                selectedCategory !== "all" ||
                selectedDusun !== "all"
              }
              onResetFilters={handleResetFilters}
            />

            {/* Pagination */}
            {!loading && !error && pagination.totalPages > 1 && (
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
          </div>
        </div>
      </div>
    </div>
  );
}
