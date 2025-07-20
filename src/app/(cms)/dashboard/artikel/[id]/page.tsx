"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Eye,
  Calendar,
  User,
  Tag,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import axios from "axios";
import { toast } from "sonner";

interface ArticleDetail {
  id: number;
  title: string;
  content: string;
  status: "draft" | "publish";
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: number;
    name: string;
  };
  writer: {
    id: number;
    fullName: string;
    dusun: string;
  };
}

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`/api/articles/${params.id}`);

        if (response.data.success) {
          setArticle(response.data.data);
        } else {
          setError(response.data.message || "Gagal memuat artikel");
        }
      } catch (error) {
        console.error("Error fetching article:", error);

        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            setError("Artikel tidak ditemukan");
          } else {
            setError(
              error.response?.data?.message ||
                "Terjadi kesalahan saat memuat artikel"
            );
          }
        } else {
          setError("Terjadi kesalahan yang tidak terduga");
        }
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchArticle();
    }
  }, [params.id]);

  const handleEdit = () => {
    router.push(`/dashboard/artikel/edit/${params.id}`);
  };

  const handleBack = () => {
    router.push("/dashboard/artikel");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Memuat artikel...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Detail Artikel</h1>
            <p className="text-muted-foreground">Melihat detail artikel</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={handleBack} className="mt-4">
                Kembali ke Daftar Artikel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Detail Artikel</h1>
            <p className="text-muted-foreground">Melihat detail artikel</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Article Content */}
      <div className="grid gap-6">
        {/* Article Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      article.status === "publish" ? "default" : "secondary"
                    }
                  >
                    {article.status === "publish" ? "Dipublikasi" : "Draft"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    ID: {article.id}
                  </span>
                </div>
                <h2 className="text-2xl font-bold">{article.title}</h2>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Article Meta */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Penulis:</span>
                <span>{article.writer.fullName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Kategori:</span>
                <span>{article.category.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Dibuat:</span>
                <span>
                  {format(new Date(article.createdAt), "dd MMM yyyy HH:mm", {
                    locale: id,
                  })}
                </span>
              </div>
            </div>

            {/* Writer Details */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Informasi Penulis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Nama:</span>{" "}
                  {article.writer.fullName}
                </div>
                <div>
                  <span className="font-medium">Dusun:</span>{" "}
                  {article.writer.dusun}
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {article.imageUrl && (
              <div className="space-y-2">
                <h3 className="font-semibold">Gambar Unggulan</h3>
                <div className="relative aspect-video w-full max-w-md">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="rounded-lg object-cover w-full h-full"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Article Content */}
        <Card>
          <CardHeader>
            <CardTitle>Konten Artikel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {article.content}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Article Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Statistik Artikel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">Total Views</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-muted-foreground">Likes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-muted-foreground">Comments</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
