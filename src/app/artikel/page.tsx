"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import axios from "axios";
import { ArtikelHeader } from "@/components/artikel/public/artikel-header";
import { CategoryFilter } from "@/components/artikel/public/category-filter";
import { ArticlesGrid } from "@/components/artikel/public/articles-grid";
import { FeaturedArticle } from "@/components/artikel/public/featured-article";
import { Skeleton } from "@/components/ui/skeleton";
import { Article } from "@/components/artikel/public/types";

// Types for API response
interface ApiArticle {
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
  nextPage?: number;
  prevPage?: number;
}

interface ArticlesResponse {
  success: boolean;
  data: {
    articles: ApiArticle[];
    pagination: Pagination;
    filters: {
      categories: Category[];
      statusCounts: {
        draft: number;
        publish: number;
      };
    };
    featuredArticle?: ApiArticle;
  };
  message: string;
}

// Lexical node type for content parsing
interface LexicalNode {
  type: string;
  text?: string;
  children?: LexicalNode[];
}

export default function ArtikelPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [categories, setCategories] = useState<string[]>(["Semua"]);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper functions
  const cleanContent = (content: string): string => {
    try {
      const parsed = JSON.parse(content);
      if (parsed.root && parsed.root.children) {
        return extractTextFromLexical(parsed.root.children);
      }
    } catch {
      return content
        .replace(/#{1,6}\s/g, "")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/\[(.*?)\]\(.*?\)/g, "$1")
        .replace(/<[^>]*>/g, "")
        .replace(/\n+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }
    return content;
  };

  const extractTextFromLexical = (children: LexicalNode[]): string => {
    let text = "";
    for (const child of children) {
      if (child.type === "text" && child.text) {
        text += child.text + " ";
      } else if (child.children) {
        text += extractTextFromLexical(child.children) + " ";
      }
    }
    return text.trim();
  };

  const calculateReadTime = (content: string): string => {
    const wordsPerMinute = 200;
    const cleanText = cleanContent(content);
    const words = cleanText
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} menit`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("id-ID", options);
  };

  const getFallbackImage = (category: string): string => {
    const fallbackImages: Record<string, string> = {
      Kesehatan:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
      Pendidikan:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop",
      Teknologi:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop",
      Ekonomi:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
      Olahraga:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
      Hiburan:
        "https://images.unsplash.com/photo-1489599162714-0d9b75c3ca1e?w=800&h=400&fit=crop",
      Komunitas:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=400&fit=crop",
      Politik:
        "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=400&fit=crop",
      default:
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=400&fit=crop",
    };
    return fallbackImages[category] || fallbackImages.default;
  };

  const transformApiArticle = (apiArticle: ApiArticle): Article => {
    const content = cleanContent(apiArticle.content);
    const imageUrl =
      apiArticle.imageUrl && !apiArticle.imageUrl.includes("example.com")
        ? apiArticle.imageUrl
        : getFallbackImage(apiArticle.category.name);

    return {
      id: apiArticle.id,
      title: apiArticle.title,
      excerpt: content.substring(0, 150) + (content.length > 150 ? "..." : ""),
      image: imageUrl,
      category: apiArticle.category.name,
      author: apiArticle.writer.fullName,
      date: formatDate(apiArticle.createdAt),
      readTime: calculateReadTime(apiArticle.content),
    };
  };

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "8",
        status: "publish",
      });

      if (activeCategory !== "Semua") {
        params.append("category", activeCategory);
      }

      const response = await axios.get<ArticlesResponse>(
        `/api/articles?${params.toString()}`
      );

      if (response.data.success) {
        // Check if articles exist and is an array
        const articlesData = response.data.data.articles;
        if (Array.isArray(articlesData)) {
          const transformedArticles = articlesData.map(transformApiArticle);
          setArticles(transformedArticles);

          // Set featured article (use first article as featured if none specified)
          if (
            currentPage === 1 &&
            activeCategory === "Semua" &&
            transformedArticles.length > 0
          ) {
            if (response.data.data.featuredArticle) {
              setFeaturedArticle(
                transformApiArticle(response.data.data.featuredArticle)
              );
            } else {
              // Use first article as featured
              setFeaturedArticle(transformedArticles[0]);
            }
          } else {
            setFeaturedArticle(null);
          }
        } else {
          console.error("Articles data is not an array:", articlesData);
          setArticles([]);
          setFeaturedArticle(null);
        }

        // Update categories if not set - check the correct path
        if (categories.length === 1) {
          const categoriesData = response.data.data.filters?.categories;
          if (Array.isArray(categoriesData)) {
            const categoryNames = [
              "Semua",
              ...categoriesData.map((cat) => cat.name),
            ];
            setCategories(categoryNames);
          } else {
            console.error("Categories data is not an array:", categoriesData);
          }
        }

        // Update pagination
        const paginationData = response.data.data.pagination;
        if (paginationData && typeof paginationData.totalPages === "number") {
          setTotalPages(paginationData.totalPages);
        } else {
          console.error("Invalid pagination data:", paginationData);
          setTotalPages(1);
        }
      } else {
        throw new Error(response.data.message || "Failed to fetch articles");
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        setError(errorMessage);
      } else {
        setError("Terjadi kesalahan yang tidak terduga");
      }
      toast.error("Gagal memuat artikel");

      // Set empty state on error
      setArticles([]);
      setFeaturedArticle(null);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, activeCategory, categories.length]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Header Skeleton */}
      <div className="bg-white border-b-2 border-gray-200">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl">
            <Skeleton className="h-12 mb-4" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Featured article skeleton */}
          <div className="bg-white rounded-2xl shadow-lg mb-12 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <Skeleton className="h-64 lg:h-80 rounded-l-2xl" />
              <div className="p-8 space-y-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8" />
                <Skeleton className="h-20" />
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
          </div>

          {/* Category filter skeleton */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-20 flex-shrink-0" />
            ))}
          </div>

          {/* Articles grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow overflow-hidden min-w-0"
              >
                <Skeleton className="h-48" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6" />
                  <Skeleton className="h-4" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Error component
  const ErrorComponent = () => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center overflow-x-hidden">
      <div className="text-center px-4">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Terjadi Kesalahan
        </h2>
        <p className="text-gray-600 mb-4 max-w-md mx-auto">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-brand-navy text-white rounded-lg hover:bg-brand-navy/90 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );

  // Empty state component
  const EmptyComponent = () => (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <ArtikelHeader
        title="Cerita Masyarakat Laiyolo Baru"
        description="Kumpulan kisah inspiratif, tradisi, dan perkembangan masyarakat Desa Laiyolo Baru dalam membangun komunitas yang lebih sehat dan sejahtera"
      />
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Belum Ada Artikel
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            {activeCategory === "Semua"
              ? "Belum ada artikel yang dipublikasikan saat ini"
              : `Belum ada artikel dalam kategori "${activeCategory}"`}
          </p>
          {activeCategory !== "Semua" && (
            <button
              onClick={() => setActiveCategory("Semua")}
              className="mt-4 px-4 py-2 text-brand-navy hover:text-brand-navy/80 transition-colors"
            >
              Lihat Semua Artikel
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Render loading state
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Render error state
  if (error) {
    return <ErrorComponent />;
  }

  // Render empty state
  if (!featuredArticle && articles.length === 0) {
    return <EmptyComponent />;
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <ArtikelHeader
        title="Cerita Masyarakat Laiyolo Baru"
        description="Kumpulan kisah inspiratif, tradisi, dan perkembangan masyarakat Desa Laiyolo Baru dalam membangun komunitas yang lebih sehat dan sejahtera"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Featured Article */}
          {featuredArticle && <FeaturedArticle article={featuredArticle} />}

          {/* Category Filter */}
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />

          {/* Articles Grid */}
          {articles.length > 0 ? (
            <ArticlesGrid
              articles={articles}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          ) : (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tidak Ada Artikel
              </h3>
              <p className="text-gray-600">
                {activeCategory === "Semua"
                  ? "Belum ada artikel lain yang tersedia"
                  : `Tidak ada artikel dalam kategori "${activeCategory}"`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
