"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Calendar,
  User,
  Tag,
  FileText,
  MapPin,
  Eye,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import axios from "axios";
import { ArticleDetailSkeleton } from "@/components/artikel/article-detail-skeleton";

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

interface LexicalNode {
  type: string;
  text?: string;
  format?: number;
  children?: LexicalNode[];
  tag?: string;
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

  // Function to parse and render content
  const renderLexicalContent = (content: string) => {
    try {
      const parsed = JSON.parse(content);

      if (!parsed.root || !parsed.root.children) {
        return content;
      }

      const renderNode = (node: LexicalNode): string => {
        if (node.type === "text") {
          let text = node.text || "";

          // Apply formatting based on node.format
          if (node.format && node.format & 1) text = `<strong>${text}</strong>`; // Bold
          if (node.format && node.format & 2) text = `<em>${text}</em>`; // Italic
          if (node.format && node.format & 4) text = `<u>${text}</u>`; // Underline

          return text;
        }

        if (node.type === "paragraph") {
          const children = node.children?.map(renderNode).join("") || "";
          return `<p>${children}</p>`;
        }

        if (node.type === "heading") {
          const level = node.tag || "h1";
          const children = node.children?.map(renderNode).join("") || "";
          return `<${level}>${children}</${level}>`;
        }

        if (node.type === "list") {
          const tag = node.tag === "ol" ? "ol" : "ul";
          const children = node.children?.map(renderNode).join("") || "";
          return `<${tag}>${children}</${tag}>`;
        }

        if (node.type === "listitem") {
          const children = node.children?.map(renderNode).join("") || "";
          return `<li>${children}</li>`;
        }

        if (node.type === "quote") {
          const children = node.children?.map(renderNode).join("") || "";
          return `<blockquote>${children}</blockquote>`;
        }

        if (node.children) {
          return node.children.map(renderNode).join("");
        }

        return "";
      };

      const htmlContent = parsed.root.children.map(renderNode).join("");
      return htmlContent;
    } catch (error) {
      console.error("Error parsing content:", error);
      return content;
    }
  };

  const renderContent = (content: string) => {
    const htmlContent = renderLexicalContent(content);

    return (
      <div
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  };

  if (loading) {
    return <ArticleDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-6">
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
    <div className="space-y-6">
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

        <Button onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Artikel
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Article Content - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Article Header */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      article.status === "publish" ? "default" : "secondary"
                    }
                    className={
                      article.status === "publish"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                    }
                  >
                    {article.status === "publish" ? "Dipublikasi" : "Draft"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    ID: {article.id}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold leading-tight">
                  {article.title}
                </h2>

                {/* Featured Image */}
                {article.imageUrl && (
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Article Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Konten Artikel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                {renderContent(article.content)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Article Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Artikel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Penulis</p>
                    <p className="text-sm text-muted-foreground">
                      {article.writer.fullName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Dusun</p>
                    <p className="text-sm text-muted-foreground">
                      {article.writer.dusun}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Kategori</p>
                    <p className="text-sm text-muted-foreground">
                      {article.category.name}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Dibuat</p>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        new Date(article.createdAt),
                        "dd MMM yyyy HH:mm",
                        { locale: id }
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Terakhir Update</p>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        new Date(article.updatedAt),
                        "dd MMM yyyy HH:mm",
                        { locale: id }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistik</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Total Views</span>
                  </div>
                  <span className="text-sm font-medium">0</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm">Likes</span>
                  <span className="text-sm font-medium">0</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm">Comments</span>
                  <span className="text-sm font-medium">0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
