"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArticleForm } from "@/components/artikel/article-form";
import { Article } from "@/components/artikel/article-types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface EditArtikelPageProps {
  params: {
    id: string;
  };
}

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

export default function EditArtikelPage({ params }: EditArtikelPageProps) {
  const router = useRouter();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`/api/articles/${params.id}`);

        if (response.data.success) {
          console.log("📄 Article data fetched:", response.data.data);
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

  const handleSave = async (articleData: Partial<Article>) => {
    console.log(" Edit page received article data:", articleData);

    try {
      // Convert form data to API format
      const updateData = {
        title: articleData.title,
        content: articleData.content,
        status: articleData.status === "published" ? "publish" : "draft",
        imageUrl: articleData.image,
        articleCategoryId: parseInt(articleData.category || "0"),
        writerId: parseInt(articleData.author || "0"),
      };

      console.log("📤 Sending update data to API:", updateData);

      const response = await axios.put(
        `/api/articles/${params.id}`,
        updateData
      );

      if (response.data.success) {
        toast.success("Artikel berhasil diperbarui!", {
          description: response.data.message,
        });
        router.push("/dashboard/artikel");
      } else {
        throw new Error(response.data.message || "Gagal memperbarui artikel");
      }
    } catch (error) {
      console.error("Update error:", error);

      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;

        if (error.response?.status === 400) {
          if (errorData?.errors) {
            const errorMessages = Object.values(errorData.errors)
              .filter(Boolean)
              .join(", ");
            toast.error("Validasi gagal", {
              description: errorMessages,
            });
          } else {
            toast.error("Data tidak lengkap", {
              description:
                errorData?.message ||
                "Mohon lengkapi semua field yang diperlukan",
            });
          }
        } else {
          toast.error("Gagal memperbarui artikel", {
            description:
              errorData?.message || "Terjadi kesalahan saat memperbarui",
          });
        }
      } else {
        toast.error("Gagal memperbarui artikel", {
          description:
            error instanceof Error
              ? error.message
              : "Terjadi kesalahan yang tidak terduga",
        });
      }
    }
  };

  const handleCancel = () => {
    if (
      confirm(
        "Apakah Anda yakin ingin membatalkan? Perubahan yang belum disimpan akan hilang."
      )
    ) {
      router.push("/dashboard/artikel");
    }
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
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Artikel</h1>
            <p className="text-muted-foreground">Edit artikel yang sudah ada</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-2">
                Artikel Tidak Ditemukan
              </h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={handleBack}>Kembali ke Daftar Artikel</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  // Convert API data to form format - KEY FIX: Include content!
  const formArticle: Partial<Article> = {
    id: article.id,
    title: article.title,
    content: article.content, // This is the key addition!
    excerpt: "", // Not used in form
    author: article.writer.id.toString(),
    category: article.category.id.toString(),
    publishDate: article.createdAt,
    status: article.status === "publish" ? "published" : "draft",
    views: 0, // Not available from API
    image: article.imageUrl || "",
  };

  console.log("📋 Form article data prepared:", formArticle);

  return (
    <ArticleForm
      article={formArticle}
      isEditing={true}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
