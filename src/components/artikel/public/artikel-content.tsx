"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import ArtikelBanner from "./artikel-banner";
import ArtikelFilters from "./artikel-filters";
import ArtikelGrid from "./artikel-grid";
import ArtikelPagination from "./artikel-pagination";
import { useDebounce } from "@/hooks/use-debounce";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  status: "draft" | "publish";
  category: {
    id: number;
    name: string;
  };
  writer: {
    id: number;
    fullName: string;
    dusun: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: number;
  name: string;
}

interface ArticleResponse {
  success: boolean;
  message: string;
  data: {
    articles: Article[];
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
      writers: Array<{ id: number; fullName: string; dusun: string }>;
    };
    overallStats: {
      totalArticles: number;
      categoryCounts: Record<string, number>;
      recentArticles: number;
    };
  };
}

export default function ArtikelPageContent() {
  // State management
  const [articleList, setArticleList] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedWriter, setSelectedWriter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  // Data states with safe defaults
  const [categories, setCategories] = useState<Category[]>([]);
  const [writers, setWriters] = useState<
    Array<{ id: number; fullName: string; dusun: string }>
  >([]);
  const [overallStats, setOverallStats] = useState({
    totalArticles: 0,
    categoryCounts: {} as Record<string, number>,
    recentArticles: 0,
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

  // Fetch Articles data
  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.itemsPerPage.toString(),
        sortBy,
        sortOrder,
        status: "publish",
      });

      if (debouncedSearch) params.append("search", debouncedSearch);
      if (selectedCategory !== "all")
        params.append("categoryId", selectedCategory);
      if (selectedWriter !== "all") params.append("writerId", selectedWriter);

      const response = await axios.get<ArticleResponse>(
        `/api/articles?${params}`
      );

      if (response.data.success) {
        const data = response.data.data;

        setArticleList(data.articles || []);
        setPagination({
          currentPage: data.pagination?.currentPage || 1,
          totalPages: data.pagination?.totalPages || 1,
          totalItems: data.pagination?.totalItems || 0,
          itemsPerPage: data.pagination?.itemsPerPage || 12,
          hasNextPage: data.pagination?.hasNextPage || false,
          hasPrevPage: data.pagination?.hasPrevPage || false,
        });
        setCategories(data.filters?.categories || []);
        setWriters(data.filters?.writers || []);
        setOverallStats({
          totalArticles: data.overallStats?.totalArticles || 0,
          categoryCounts: data.overallStats?.categoryCounts || {},
          recentArticles: data.overallStats?.recentArticles || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching articles:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setArticleList([]);
          setPagination((prev) => ({ ...prev, totalItems: 0, totalPages: 0 }));
        } else {
          const errorMessage =
            error.response?.data?.message || "Gagal memuat data artikel";
          setError(errorMessage);
          toast.error("Gagal memuat data", {
            description: errorMessage,
          });
        }
      } else {
        setError("Terjadi kesalahan yang tidak terduga");
        toast.error("Terjadi kesalahan", {
          description: "Gagal memuat data artikel",
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
    selectedWriter,
    sortBy,
    sortOrder,
  ]);

  // Effects
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Reset to first page when filters change
  useEffect(() => {
    if (pagination.currentPage !== 1) {
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }
  }, [debouncedSearch, selectedCategory, selectedWriter, sortBy, sortOrder]);

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

  const handleWriterFilter = (writerId: string) => {
    setSelectedWriter(writerId);
  };

  const handleSort = (field: string, order: "ASC" | "DESC") => {
    setSortBy(field);
    setSortOrder(order);
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedWriter("all");
    setSortBy("createdAt");
    setSortOrder("DESC");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Banner */}
      <ArtikelBanner
        totalArticles={overallStats.totalArticles}
        categoryCounts={overallStats.categoryCounts}
        categories={categories}
        recentArticles={overallStats.recentArticles}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <ArtikelFilters
                search={search}
                selectedCategory={selectedCategory}
                selectedWriter={selectedWriter}
                categories={categories}
                writers={writers}
                onSearch={handleSearch}
                onCategoryFilter={handleCategoryFilter}
                onWriterFilter={handleWriterFilter}
                onSort={handleSort}
                onResetFilters={handleResetFilters}
                currentSort={{ field: sortBy, order: sortOrder }}
                loading={loading}
                totalItems={pagination.totalItems}
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
                    Menampilkan {articleList.length} dari{" "}
                    {pagination.totalItems} artikel
                  </span>
                )}
              </div>
            </div>

            {/* Articles Grid */}
            <ArtikelGrid
              articleList={articleList}
              loading={loading}
              error={error}
              hasActiveFilters={
                debouncedSearch !== "" ||
                selectedCategory !== "all" ||
                selectedWriter !== "all"
              }
              onResetFilters={handleResetFilters}
            />

            {/* Pagination */}
            {!loading && !error && pagination.totalPages > 1 && (
              <ArtikelPagination
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
