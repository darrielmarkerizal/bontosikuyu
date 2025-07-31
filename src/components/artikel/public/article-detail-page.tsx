"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Tag, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import Image from "next/image";

interface Article {
  id: number;
  title: string;
  content: string; // Now HTML content from Tiptap
  status: string;
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

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/articles/${params.id}`);

        if (response.data.success) {
          setArticle(response.data.data);
        } else {
          toast.error("Artikel tidak ditemukan");
          router.push("/artikel");
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        toast.error("Gagal memuat artikel");
        router.push("/artikel");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchArticle();
    }
  }, [params.id, router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          text: article?.title,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link artikel berhasil disalin");
      } catch (error) {
        console.error("Error copying to clipboard:", error);
        toast.error("Gagal menyalin link");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Artikel tidak ditemukan
            </h1>
            <Button onClick={() => router.push("/artikel")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar Artikel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/artikel")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Daftar Artikel
        </Button>

        {/* Article Card */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-4">
            {/* Title */}
            <CardTitle className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              {article.title}
            </CardTitle>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{article.writer.fullName}</span>
                <span className="text-gray-400">•</span>
                <span>{article.writer.dusun}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(article.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                <Badge variant="secondary">{article.category.name}</Badge>
              </div>
            </div>

            {/* Featured Image */}
            {article.imageUrl && (
              <div className="relative w-full h-64 sm:h-80 rounded-lg overflow-hidden">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                lineHeight: "1.6",
              }}
            />

            {/* Share Button */}
            <div className="flex justify-center pt-8 border-t">
              <Button onClick={handleShare} variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Bagikan Artikel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
