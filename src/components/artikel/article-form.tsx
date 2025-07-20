"use client";

import { useState } from "react";
import { SerializedEditorState } from "lexical";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Editor } from "../blocks/editor-00/editor";
import { ImageUpload } from "./image-upload";
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
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (file: File | null) => {
    setFeaturedImage(file);
  };

  const handleImageError = (message: string) => {
    console.error(message);
  };

  const handleSave = (status: "draft" | "published" = "draft") => {
    const articleData = {
      ...formData,
      status,
      content: editorState,
      featuredImage,
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
      featuredImage,
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

      {/* Single Card Layout - Single Column */}
      <Card>
        <CardHeader>
          <CardTitle>Form Artikel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
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

          {/* Excerpt */}
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

          {/* Publication Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                onChange={(e) => handleInputChange("category", e.target.value)}
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
          </div>

          {/* Featured Image */}
          <ImageUpload
            onChange={handleImageChange}
            onError={handleImageError}
          />

          {/* Content Editor */}
          <div className="space-y-2">
            <Label>Konten Artikel</Label>
            <div className="min-h-[400px] border border-input rounded-md [&_.EditorTheme__paragraph]:my-1 [&_.EditorTheme__heading]:my-2 [&_.EditorTheme__list]:my-1 [&_.EditorTheme__quote]:my-1">
              <Editor
                editorSerializedState={editorState}
                onSerializedChange={(value) => setEditorState(value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
