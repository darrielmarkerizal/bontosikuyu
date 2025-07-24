"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { useDebounce } from "@/hooks/use-debounce";

// Components
import { WisataHeader } from "@/components/wisata/wisata-header";
import { WisataStats } from "@/components/wisata/wisata-stats";
import { WisataFilters } from "@/components/wisata/wisata-filter";
import { WisataGrid } from "@/components/wisata/wisata-grid";
import { WisataPagination } from "@/components/wisata/wisata-pagination";
import { WisataDetailModal } from "@/components/wisata/wisata-detail-modal";

// Types
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

interface OverallStats {
  totalTravels: number;
  dusunCounts: Record<string, number>;
  categoryCounts: Record<string, number>;
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
    overallStats: OverallStats;
  };
}

export default function WisataPage() {
  // States
  const [travels, setTravels] = useState<Travel[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dusunOptions, setDusunOptions] = useState<string[]>([]);
  const [overallStats, setOverallStats] = useState<OverallStats>({
    totalTravels: 0,
    dusunCounts: {},
    categoryCounts: {},
  });
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDusun, setSelectedDusun] = useState<string>("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  // UI States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTravel, setSelectedTravel] = useState<Travel | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Hooks
  const router = useRouter();
  const searchParams = useSearchParams();
  const debouncedSearch = useDebounce(search, 500);

  // Initialize from URL params
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    const urlCategory = searchParams.get("category") || "all";
    const urlDusun = searchParams.get("dusun") || "all";
    const urlPage = parseInt(searchParams.get("page") || "1");

    setSearch(urlSearch);
    setSelectedCategory(urlCategory);
    setSelectedDusun(urlDusun);
    setPagination((prev) => ({ ...prev, currentPage: urlPage }));
  }, [searchParams]);

  // Fetch travels data
  const fetchTravels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.itemsPerPage.toString(),
        sortBy,
        sortOrder,
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
          setError(errorMessage);
          toast.error("Gagal memuat data wisata", {
            description: errorMessage,
          });
        }
      } else {
        const errorMessage = "Terjadi kesalahan yang tidak terduga";
        setError(errorMessage);
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
    sortBy,
    sortOrder,
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
  }, [debouncedSearch, selectedCategory, selectedDusun, sortBy, sortOrder]);

  // URL sync
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (selectedDusun !== "all") params.set("dusun", selectedDusun);
    if (pagination.currentPage > 1)
      params.set("page", pagination.currentPage.toString());

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params}`
      : window.location.pathname;

    router.replace(newUrl, { scroll: false });
  }, [search, selectedCategory, selectedDusun, pagination.currentPage, router]);

  // Event handlers
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
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

  const handleTravelClick = (travel: Travel) => {
    setSelectedTravel(travel);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedTravel(null);
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
      {/* Header */}
      <WisataHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Stats */}
          <WisataStats overallStats={overallStats} loading={loading} />

          {/* Filters */}
          <WisataFilters
            search={search}
            selectedCategory={selectedCategory}
            selectedDusun={selectedDusun}
            categories={categories}
            dusunOptions={dusunOptions}
            onSearch={handleSearch}
            onCategoryFilter={handleCategoryFilter}
            onDusunFilter={handleDusunFilter}
            onSort={handleSort}
            onResetFilters={handleResetFilters}
            currentSort={{ field: sortBy, order: sortOrder }}
            loading={loading}
          />

          {/* Content */}
          {error ? (
            <div className="text-center py-16">
              <div className="space-y-4">
                <div className="text-6xl">😕</div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Terjadi Kesalahan
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">{error}</p>
                <button
                  onClick={fetchTravels}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 rounded-lg transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          ) : travels.length === 0 ? (
            <div className="text-center py-16">
              <div className="space-y-4">
                <div className="text-6xl">🏝️</div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Tidak Ada Wisata Ditemukan
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {debouncedSearch ||
                  selectedCategory !== "all" ||
                  selectedDusun !== "all"
                    ? "Coba ubah filter pencarian untuk menemukan wisata yang sesuai"
                    : "Belum ada wisata yang tersedia saat ini"}
                </p>
                {(debouncedSearch ||
                  selectedCategory !== "all" ||
                  selectedDusun !== "all") && (
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors"
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Travel Grid */}
              <WisataGrid
                travels={travels}
                onTravelClick={handleTravelClick}
                loading={loading}
              />

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <WisataPagination
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
        </div>
      </div>

      {/* Detail Modal */}
      <WisataDetailModal
        travel={selectedTravel}
        open={showDetailModal}
        onClose={handleCloseModal}
      />
    </div>
  );
}
