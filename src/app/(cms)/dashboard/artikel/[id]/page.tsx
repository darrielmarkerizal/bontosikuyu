"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Eye,
  Calendar,
  User,
  Tag,
  Loader2,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import axios from "axios";

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

  // Update the renderContent function in the component
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
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="rounded-lg object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>
            )}
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
            <div className="bg-muted/30 p-4 rounded-lg">
              {renderContent(article.content)}
            </div>
          </CardContent>
        </Card>

        {/* Article Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Statistik Artikel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">Total Views</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-muted-foreground">Likes</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
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
