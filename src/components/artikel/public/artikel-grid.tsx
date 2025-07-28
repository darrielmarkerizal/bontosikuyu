"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  User,
  Clock,
  ExternalLink,
  FileText,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
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

interface ArtikelGridProps {
  articleList: Article[];
  loading: boolean;
  error: string | null;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

// Loading skeleton component - NO ANIMATION
function ArticleCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-48 bg-gray-200"></div>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-9 bg-gray-200 rounded w-24"></div>
        </div>
      </CardContent>
    </Card>
  );
}

// Individual Article card component
function ArticleCard({ article }: { article: Article }) {
  const [imageError, setImageError] = useState(false);

  const fallbackImages: Record<string, string> = {
    Kesehatan:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=300&fit=crop",
    Pendidikan:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&h=300&fit=crop",
    Teknologi:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=300&fit=crop",
    Ekonomi:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&h=300&fit=crop",
    default:
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&h=300&fit=crop",
  };

  const getImageUrl = () => {
    if (article.imageUrl && !imageError) {
      return article.imageUrl;
    }
    return fallbackImages[article.category.name] || fallbackImages.default;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: id });
    } catch {
      return "Tanggal tidak valid";
    }
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} menit`;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={getImageUrl()}
          alt={`Foto artikel: ${article.title}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-white/90 text-brand-secondary border-0 font-plus-jakarta-sans">
            {article.category.name}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-brand-secondary font-sentient line-clamp-2 group-hover:text-brand-primary transition-colors">
            {article.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-3 font-plus-jakarta-sans leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <User className="h-4 w-4" />
            <span className="text-sm font-plus-jakarta-sans">
              {article.writer.fullName}
            </span>
            <Badge variant="secondary" className="text-xs">
              {article.writer.dusun}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-plus-jakarta-sans">
              {formatDate(article.createdAt)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-plus-jakarta-sans">
              {calculateReadTime(article.content)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link href={`/artikel/${article.id}`} className="flex-1">
            <Button className="w-full bg-brand-primary hover:bg-brand-primary/90 text-brand-secondary font-plus-jakarta-sans">
              <FileText className="h-4 w-4 mr-2" />
              Baca Artikel
            </Button>
          </Link>
          <Button
            variant="outline"
            size="icon"
            className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ArtikelGrid({
  articleList,
  loading,
  error,
  hasActiveFilters,
  onResetFilters,
}: ArtikelGridProps) {
  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <ArticleCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2 font-sentient">
          Terjadi Kesalahan
        </h3>
        <p className="text-gray-600 mb-6 font-plus-jakarta-sans max-w-md mx-auto">
          {error}
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-brand-primary hover:bg-brand-primary/90 text-brand-secondary font-plus-jakarta-sans"
        >
          Muat Ulang Halaman
        </Button>
      </div>
    );
  }

  // Empty state
  if (articleList.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <FileText className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2 font-sentient">
          Tidak Ada Artikel Ditemukan
        </h3>
        <p className="text-gray-600 mb-6 font-plus-jakarta-sans max-w-md mx-auto">
          {hasActiveFilters
            ? "Coba ubah filter pencarian untuk menemukan artikel yang sesuai"
            : "Belum ada artikel yang dipublikasikan saat ini"}
        </p>
        {hasActiveFilters && (
          <Button
            onClick={onResetFilters}
            variant="outline"
            className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-plus-jakarta-sans"
          >
            Reset Filter
          </Button>
        )}
      </div>
    );
  }

  // Success state - show Article cards
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {articleList.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
