"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArtikelHeader,
  FeaturedArticle,
  CategoryFilter,
  ArticlesGrid,
  Sidebar,
  type Article,
} from "@/components/artikel/public";

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
}

interface ArticlesResponse {
  success: boolean;
  message: string;
  data: {
    articles: ApiArticle[];
    pagination: Pagination;
    filters: {
      categories: Category[];
    };
  };
}

// Define the SidebarArticle type
interface SidebarArticleType {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
}

// Types for Lexical editor nodes
interface LexicalNode {
  type: string;
  text?: string;
  children?: LexicalNode[];
}

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
  const words = cleanText.split(/\s+/).filter((word) => word.length > 0).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} menit`;
};

const createExcerpt = (content: string, maxLength: number = 150): string => {
  const cleanText = cleanContent(content);
  if (cleanText.length <= maxLength) return cleanText;
  const truncated = cleanText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");
  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex) + "...";
  }
  return truncated + "...";
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString("id-ID", options);
};

const getFallbackImage = (category: string): string => {
  const fallbackImages: Record<string, string> = {
    Kesehatan:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=240&fit=crop",
    Pendidikan:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=240&fit=crop",
    Teknologi:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=240&fit=crop",
    Ekonomi:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=240&fit=crop",
    Olahraga:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=240&fit=crop",
    Hiburan:
      "https://images.unsplash.com/photo-1489599162714-0d9b75c3ca1e?w=400&h=240&fit=crop",
    Politik:
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&h=240&fit=crop",
    Berita:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=240&fit=crop",
    Kebudayaan:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=240&fit=crop",
    Lingkungan:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=240&fit=crop",
    Seni: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=240&fit=crop",
    Pariwisata:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=240&fit=crop",
    Kuliner:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=240&fit=crop",
    Agama:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=240&fit=crop",
    Sosial:
      "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=240&fit=crop",
    Hukum:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=240&fit=crop",
    Inovasi:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=240&fit=crop",
    Sejarah:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=240&fit=crop",
    Lifestyle:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=240&fit=crop",
    Komunitas:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=240&fit=crop",
  };
  return (
    fallbackImages[category] ||
    "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=240&fit=crop"
  );
};

// Convert API article to Article type
const convertApiArticleToArticle = (apiArticle: ApiArticle): Article => ({
  id: apiArticle.id,
  title: apiArticle.title,
  excerpt: createExcerpt(apiArticle.content),
  author: apiArticle.writer.fullName,
  date: formatDate(apiArticle.createdAt),
  readTime: calculateReadTime(apiArticle.content),
  category: apiArticle.category.name,
  image:
    apiArticle.imageUrl && !apiArticle.imageUrl.includes("example.com")
      ? apiArticle.imageUrl
      : getFallbackImage(apiArticle.category.name),
});

// Convert API article to SidebarArticle type
const convertApiArticleToSidebarArticle = (
  apiArticle: ApiArticle
): SidebarArticleType => ({
  id: apiArticle.id,
  title: apiArticle.title,
  excerpt: createExcerpt(apiArticle.content, 100),
  author: apiArticle.writer.fullName,
  date: formatDate(apiArticle.createdAt),
  readTime: calculateReadTime(apiArticle.content),
  category: apiArticle.category.name,
});

export default function ArtikelPage() {
  // State management
  const [articles, setArticles] = useState<Article[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [sidebarArticles, setSidebarArticles] = useState<SidebarArticleType[]>(
    []
  );
  const [categories, setCategories] = useState<string[]>(["Semua"]);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const articlesPerPage = 6;

  // Fetch articles from API
  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: (articlesPerPage + 1).toString(), // +1 for featured article
        status: "publish",
        sortBy: "createdAt",
        sortOrder: "DESC",
      });

      // Add category filter if not "Semua"
      if (activeCategory !== "Semua") {
        // Find category ID by name
        const response = await axios.get<ArticlesResponse>("/api/articles", {
          params: { limit: 1, status: "publish" },
        });

        if (response.data.success) {
          const categoryData = response.data.data.filters.categories.find(
            (cat) => cat.name === activeCategory
          );
          if (categoryData) {
            params.append("categoryId", categoryData.id.toString());
          }
        }
      }

      const response = await axios.get<ArticlesResponse>(
        `/api/articles?${params}`
      );

      if (response.data.success) {
        const apiArticles = response.data.data.articles;
        const convertedArticles = apiArticles.map(convertApiArticleToArticle);

        // Set featured article (first article)
        if (convertedArticles.length > 0) {
          setFeaturedArticle(convertedArticles[0]);
          setArticles(convertedArticles.slice(1)); // Rest for grid
        } else {
          setFeaturedArticle(null);
          setArticles([]);
        }

        // Update pagination
        const pagination = response.data.data.pagination;
        setTotalPages(pagination.totalPages);

        // Set categories (only once)
        if (categories.length === 1) {
          const categoryNames = [
            "Semua",
            ...response.data.data.filters.categories.map((cat) => cat.name),
          ];
          setCategories(categoryNames);
        }
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setArticles([]);
          setFeaturedArticle(null);
        } else {
          const errorMessage = error.response?.data?.message || error.message;
          setError(errorMessage);
          toast.error("Gagal memuat artikel", { description: errorMessage });
        }
      } else {
        const errorMessage = "Terjadi kesalahan yang tidak terduga";
        setError(errorMessage);
        toast.error("Terjadi kesalahan", { description: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, activeCategory, categories.length]);

  // Fetch sidebar articles (recent articles)
  const fetchSidebarArticles = useCallback(async () => {
    try {
      const response = await axios.get<ArticlesResponse>("/api/articles", {
        params: {
          limit: 5,
          status: "publish",
          sortBy: "createdAt",
          sortOrder: "DESC",
        },
      });

      if (response.data.success) {
        const sidebarData = response.data.data.articles
          .slice(0, 5) // Take only 5 articles
          .map(convertApiArticleToSidebarArticle);
        setSidebarArticles(sidebarData);
      }
    } catch (error) {
      console.error("Error fetching sidebar articles:", error);
    }
  }, []);

  // Effects
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  useEffect(() => {
    fetchSidebarArticles();
  }, [fetchSidebarArticles]);

  // Reset to first page when category changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  // Event handlers
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-slate-50">
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
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            {/* Featured article skeleton */}
            <div className="bg-white rounded-2xl shadow-lg mb-12">
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
            <div className="flex gap-2 mb-8">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-20" />
              ))}
            </div>

            {/* Articles grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow overflow-hidden"
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

          {/* Sidebar skeleton */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg p-6">
              <Skeleton className="h-6 mb-4" />
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="w-16 h-16 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Error component
  const ErrorComponent = () => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Terjadi Kesalahan
        </h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );

  // Empty state component
  const EmptyComponent = () => (
    <div className="min-h-screen bg-slate-50">
      <ArtikelHeader
        title="Cerita Masyarakat Laiyolo Baru"
        description="Kumpulan kisah inspiratif, tradisi, dan perkembangan masyarakat Desa Laiyolo Baru dalam membangun komunitas yang lebih sehat dan sejahtera"
      />
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Belum Ada Artikel
        </h2>
        <p className="text-gray-600">
          {activeCategory === "Semua"
            ? "Belum ada artikel yang dipublikasikan saat ini"
            : `Belum ada artikel dalam kategori "${activeCategory}"`}
        </p>
        {activeCategory !== "Semua" && (
          <button
            onClick={() => setActiveCategory("Semua")}
            className="mt-4 px-4 py-2 text-brand-primary hover:text-brand-primary/80 transition-colors"
          >
            Lihat Semua Artikel
          </button>
        )}
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
    <div className="min-h-screen bg-slate-50">
      <ArtikelHeader
        title="Cerita Masyarakat Laiyolo Baru"
        description="Kumpulan kisah inspiratif, tradisi, dan perkembangan masyarakat Desa Laiyolo Baru dalam membangun komunitas yang lebih sehat dan sejahtera"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
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

          {/* Sidebar */}
          <Sidebar articles={sidebarArticles} />
        </div>
      </div>
    </div>
  );
}
