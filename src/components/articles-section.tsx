"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BoxReveal } from "./magicui/box-reveal";
import { ArticleCard } from "./artikel/public/article-card";
import { Article } from "@/components/artikel/public/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import axios from "axios";

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

interface ArticlesResponse {
  success: boolean;
  message: string;
  data: {
    articles: ApiArticle[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

// Helper function to clean and extract plain text from content
const cleanContent = (content: string): string => {
  try {
    // Try to parse as JSON (Lexical editor format)
    const parsed = JSON.parse(content);
    if (parsed.root && parsed.root.children) {
      return extractTextFromLexical(parsed.root.children);
    }
  } catch {
    // If not JSON, treat as markdown or HTML
    return content
      .replace(/#{1,6}\s/g, "") // Remove markdown headers
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold markdown
      .replace(/\*(.*?)\*/g, "$1") // Remove italic markdown
      .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Remove markdown links
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/\n+/g, " ") // Replace newlines with spaces
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .trim();
  }

  return content;
};

// Interface for Lexical editor nodes
interface LexicalNode {
  type: string;
  text?: string;
  children?: LexicalNode[];
}

// Helper function to extract text from Lexical editor format
const extractTextFromLexical = (children: LexicalNode[]): string => {
  let text = "";

  for (const child of children) {
    if (child.type === "text") {
      text += child.text + " ";
    } else if (child.children) {
      text += extractTextFromLexical(child.children) + " ";
    }
  }

  return text.trim();
};

// Helper function to calculate read time
const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const cleanText = cleanContent(content);
  const words = cleanText.split(/\s+/).filter((word) => word.length > 0).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} menit`;
};

// Helper function to create excerpt
const createExcerpt = (content: string, maxLength: number = 150): string => {
  const cleanText = cleanContent(content);

  if (cleanText.length <= maxLength) return cleanText;

  // Find the last complete word within maxLength
  const truncated = cleanText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex) + "...";
  }

  return truncated + "...";
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString("id-ID", options);
};

// Helper function to get fallback image based on category
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

  return fallbackImages[category] || fallbackImages["default"];
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

// Custom ArticleCard with image fallback
const ArticleCardWithFallback = ({
  article,
  index,
}: {
  article: Article;
  index: number;
}) => {
  const [imageSrc, setImageSrc] = useState(article.image);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageSrc(getFallbackImage(article.category));
    }
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  // Create modified article with current image src
  const articleWithFallback = {
    ...article,
    image: imageSrc,
  };

  return (
    <div className="relative">
      <ArticleCard
        article={articleWithFallback}
        index={index}
        onImageError={handleImageError}
        onImageLoad={handleImageLoad}
      />

      {/* Image Error Overlay (if needed for debugging) */}
      {imageError && process.env.NODE_ENV === "development" && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
          Fallback
        </div>
      )}
    </div>
  );
};

export default function ArticlesSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch 3 latest published articles
        const response = await axios.get<ArticlesResponse>("/api/articles", {
          params: {
            limit: 3,
            status: "publish",
            sortBy: "createdAt",
            sortOrder: "DESC",
          },
        });

        if (response.data.success) {
          const convertedArticles = response.data.data.articles.map(
            convertApiArticleToArticle
          );
          setArticles(convertedArticles);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);

        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            // No articles found, keep empty array
            setArticles([]);
          } else {
            setError("Gagal memuat artikel terbaru");
          }
        } else {
          setError("Terjadi kesalahan yang tidak terduga");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLatestArticles();
  }, []);

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl overflow-hidden shadow-lg animate-pulse"
        >
          <div className="h-48 bg-gray-200"></div>
          <div className="p-6 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error state
  const ErrorState = () => (
    <div className="text-center py-12">
      <div className="space-y-4">
        <div className="text-4xl">📰</div>
        <h3 className="text-xl font-semibold text-gray-900">
          Gagal Memuat Artikel
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );

  // Empty state
  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="space-y-4">
        <div className="text-4xl">📝</div>
        <h3 className="text-xl font-semibold text-gray-900">
          Belum Ada Artikel
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Artikel terbaru akan ditampilkan di sini setelah dipublikasikan
        </p>
      </div>
    </div>
  );

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <BoxReveal
            boxColor="#F8B72C"
            duration={0.5}
            width="fit-content"
            textAlign="center"
          >
            <div className="inline-flex items-center px-6 py-3 bg-brand-primary/10 rounded-full border border-brand-primary/20 mb-6">
              <span className="text-sm font-medium text-brand-primary font-plus-jakarta-sans tracking-wide uppercase">
                Artikel Terbaru
              </span>
            </div>
          </BoxReveal>

          <BoxReveal
            boxColor="#F8B72C"
            duration={0.5}
            width="100%"
            textAlign="center"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-sentient font-bold text-brand-secondary mb-6">
              Cerita & Informasi
            </h2>
          </BoxReveal>

          <BoxReveal
            boxColor="#F8B72C"
            duration={0.5}
            width="100%"
            textAlign="center"
          >
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto font-plus-jakarta-sans leading-relaxed">
              Temukan artikel terbaru seputar kesehatan, gizi, dan perkembangan
              anak untuk mendukung tumbuh kembang optimal di Desa Laiyolo Baru
            </p>
          </BoxReveal>
        </div>

        {/* Articles Content */}
        <div className="mb-12">
          {loading ? (
            <BoxReveal
              boxColor="#21BCA8"
              duration={0.6}
              width="100%"
              textAlign="center"
            >
              <LoadingSkeleton />
            </BoxReveal>
          ) : error ? (
            <BoxReveal
              boxColor="#21BCA8"
              duration={0.6}
              width="100%"
              textAlign="center"
            >
              <ErrorState />
            </BoxReveal>
          ) : articles.length === 0 ? (
            <BoxReveal
              boxColor="#21BCA8"
              duration={0.6}
              width="100%"
              textAlign="center"
            >
              <EmptyState />
            </BoxReveal>
          ) : (
            <BoxReveal
              boxColor="#21BCA8"
              duration={0.6}
              width="100%"
              textAlign="center"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article, index) => (
                  <ArticleCardWithFallback
                    key={article.id}
                    article={article}
                    index={index}
                  />
                ))}
              </div>
            </BoxReveal>
          )}
        </div>

        {/* Call to Action - Only show if there are articles */}
        {!loading && !error && articles.length > 0 && (
          <BoxReveal
            boxColor="#F8B72C"
            duration={0.5}
            width="fit-content"
            textAlign="center"
          >
            <div className="text-center">
              <Link href="/artikel">
                <Button
                  size="lg"
                  className="bg-brand-primary text-brand-secondary hover:bg-brand-primary/90 hover:text-brand-secondary px-8 py-4 text-lg font-plus-jakarta-sans font-semibold shadow-xl transition-all duration-300 group"
                >
                  Lihat Semua Artikel
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </BoxReveal>
        )}
      </div>
    </section>
  );
}
