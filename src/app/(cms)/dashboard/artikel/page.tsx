"use client";

import { useState, useEffect } from "react";
import { ArticleHeader } from "@/components/artikel/article-header";
import { ArticleTable } from "@/components/artikel/article-table";
import { ArticlePagination } from "@/components/artikel/article-pagination";
import { ArticleStats } from "@/components/artikel/article-stats";
import { ArticleFilters } from "@/components/artikel/article-filters";
import { ArticleSkeleton } from "@/components/artikel/article-skeleton";

interface Article {
  id: number;
  title: string;
  content: string;
  status: "draft" | "publish";
  imageUrl?: string;
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

interface ApiResponse {
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
      nextPage: number | null;
      prevPage: number | null;
    };
    filters: {
      categories: Array<{ id: number; name: string }>;
      statusCounts: Record<string, number>;
    };
    appliedFilters: {
      search?: string;
      status?: string;
      categoryId?: number;
    };
    appliedSort: {
      field: string;
      order: string;
    };
  };
  timestamp: string;
}

export default function ArtikelPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    categoryId: "",
    sortBy: "createdAt",
    sortOrder: "DESC" as "ASC" | "DESC",
  });
  const [categories, setCategories] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.itemsPerPage.toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      if (filters.search) params.append("search", filters.search);
      if (filters.status) params.append("status", filters.status);
      if (filters.categoryId) params.append("categoryId", filters.categoryId);

      const response = await fetch(`/api/articles?${params}`);
      const data: ApiResponse = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setArticles([]);
          setPagination((prev) => ({ ...prev, totalItems: 0, totalPages: 0 }));
          return;
        }
        throw new Error(
          data.message || "Terjadi kesalahan saat mengambil data"
        );
      }

      setArticles(data.data.articles);
      setPagination({
        currentPage: data.data.pagination.currentPage,
        totalPages: data.data.pagination.totalPages,
        totalItems: data.data.pagination.totalItems,
        itemsPerPage: data.data.pagination.itemsPerPage,
        hasNextPage: data.data.pagination.hasNextPage,
        hasPrevPage: data.data.pagination.hasPrevPage,
      });
      setCategories(data.data.filters.categories);
      setStatusCounts(data.data.filters.statusCounts);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [pagination.currentPage, filters]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleSearch = (search: string) => {
    handleFilterChange({ search });
  };

  const handleStatusFilter = (status: string) => {
    handleFilterChange({ status: status || "" });
  };

  const handleCategoryFilter = (categoryId: string) => {
    handleFilterChange({ categoryId: categoryId || "" });
  };

  const handleSort = (field: string, order: "ASC" | "DESC") => {
    handleFilterChange({ sortBy: field, sortOrder: order });
  };

  if (loading && articles.length === 0) {
    return <ArticleSkeleton />;
  }

  return (
    <div className="space-y-6">
      <ArticleHeader />

      <ArticleStats
        totalArticles={pagination.totalItems}
        statusCounts={statusCounts}
      />

      <div className="space-y-4">
        <ArticleFilters
          search={filters.search}
          status={filters.status}
          categoryId={filters.categoryId}
          categories={categories}
          onSearch={handleSearch}
          onStatusFilter={handleStatusFilter}
          onCategoryFilter={handleCategoryFilter}
          onSort={handleSort}
          currentSort={{ field: filters.sortBy, order: filters.sortOrder }}
        />

        {error ? (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Tidak ada artikel yang ditemukan</p>
          </div>
        ) : (
          <>
            <ArticleTable articles={articles} loading={loading} />

            <ArticlePagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}
