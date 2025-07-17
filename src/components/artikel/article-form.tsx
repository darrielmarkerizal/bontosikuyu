"use client";

import { useState } from "react";
import { SerializedEditorState } from "lexical";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Editor } from "../blocks/editor-00/editor";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { Article } from "./article-types";

const initialEditorValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "Mulai menulis artikel Anda di sini...",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState;

interface ArticleFormProps {
  article?: Partial<Article>;
  isEditing?: boolean;
  onSave?: (article: Partial<Article>) => void;
  onCancel?: () => void;
  onPreview?: (article: Partial<Article>) => void;
}

export function ArticleForm({
  article,
  isEditing = false,
  onSave,
  onCancel,
  onPreview,
}: ArticleFormProps) {
  const [formData, setFormData] = useState({
    title: article?.title || "",
    excerpt: article?.excerpt || "",
    author: article?.author || "",
    category: article?.category || "",
    status: article?.status || ("draft" as const),
  });

  const [editorState, setEditorState] =
    useState<SerializedEditorState>(initialEditorValue);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = (status: "draft" | "published" = "draft") => {
    const articleData = {
      ...formData,
      status,
      content: editorState,
      publishDate: new Date().toISOString().split("T")[0],
      views: article?.views || 0,
      image: article?.image || "/api/placeholder/300/200",
      id: article?.id || Date.now(), // Generate ID for new articles
    };

    onSave?.(articleData);
  };

  const handlePreview = () => {
    const articleData = {
      ...formData,
      content: editorState,
    };
    onPreview?.(articleData);
  };

  const categories = [
    "Infrastruktur",
    "Budaya",
    "Ekonomi",
    "Kesehatan",
    "Lingkungan",
    "Pendidikan",
    "Sosial",
    "Teknologi",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? "Edit Artikel" : "Tambah Artikel Baru"}
            </h1>
            <p className="text-muted-foreground">
              {isEditing
                ? "Perbarui artikel yang sudah ada"
                : "Buat artikel baru untuk website Desa Laiyolo Baru"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button variant="outline" onClick={() => handleSave("draft")}>
            <Save className="mr-2 h-4 w-4" />
            Simpan Draft
          </Button>
          <Button onClick={() => handleSave("published")}>Publikasikan</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Artikel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Artikel *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Masukkan judul artikel..."
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Ringkasan Artikel *</Label>
                <textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange("excerpt", e.target.value)}
                  placeholder="Tulis ringkasan singkat artikel (max 200 karakter)..."
                  rows={3}
                  maxLength={200}
                  className="w-full px-3 py-2 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
                <p className="text-xs text-muted-foreground">
                  {formData.excerpt.length}/200 karakter
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle>Konten Artikel</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="min-h-[400px]">
                <Editor
                  editorSerializedState={editorState}
                  onSerializedChange={(value) => setEditorState(value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Article Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Publikasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="author">Penulis *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                  placeholder="Nama penulis..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategori *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  <option value="">Pilih kategori...</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    handleInputChange(
                      "status",
                      e.target.value as "draft" | "published"
                    )
                  }
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Dipublikasi</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Gambar Unggulan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Belum ada gambar dipilih
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Pilih Gambar
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Ukuran yang disarankan: 1200x630px (JPG, PNG)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo-title">SEO Title</Label>
                <Input
                  id="seo-title"
                  placeholder="Judul untuk SEO..."
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground">0/60 karakter</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo-description">Meta Description</Label>
                <textarea
                  id="seo-description"
                  placeholder="Deskripsi untuk mesin pencari..."
                  rows={3}
                  maxLength={160}
                  className="w-full px-3 py-2 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
                <p className="text-xs text-muted-foreground">0/160 karakter</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
