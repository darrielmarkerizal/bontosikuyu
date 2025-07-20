"use client";

import { useState, useEffect } from "react";
import { SerializedEditorState } from "lexical";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Editor } from "../blocks/editor-00/editor";
import { ImageUpload } from "./image-upload";
import { WriterCombobox } from "@/components/ui/writer-combobox";
import { ArrowLeft, Save, Eye, Loader2 } from "lucide-react";
import { Article } from "./article-types";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

interface MasterData {
  categories: Array<{ id: number; name: string }>;
  writers: Array<{ id: number; fullName: string; dusun: string }>;
}

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
  onCancel,
  onPreview,
}: ArticleFormProps) {
  const router = useRouter();
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
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string | null>(null);
  const [masterData, setMasterData] = useState<MasterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch master data on component mount
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const response = await axios.get("/api/master-data");
        if (response.data.success) {
          setMasterData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching master data:", error);
        toast.error("Gagal memuat data master", {
          description: "Tidak dapat memuat data kategori dan penulis",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMasterData();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (file: File | null, url?: string) => {
    setFeaturedImage(file);
    setFeaturedImageUrl(url || null);
  };

  const handleImageError = (message: string) => {
    console.error(message);
  };

  const handleSave = async (status: "draft" | "published" = "draft") => {
    // Validate required fields
    if (!formData.title.trim()) {
      toast.error("Judul artikel wajib diisi");
      return;
    }

    if (!formData.author) {
      toast.error("Penulis wajib dipilih");
      return;
    }

    if (!formData.category) {
      toast.error("Kategori wajib dipilih");
      return;
    }

    // Convert editor state to string content
    const contentString = JSON.stringify(editorState);

    setSaving(true);
    try {
      const articleData = {
        title: formData.title.trim(),
        content: contentString,
        status: status === "published" ? "publish" : "draft",
        imageUrl: featuredImageUrl,
        articleCategoryId: parseInt(formData.category),
        writerId: parseInt(formData.author),
      };

      const response = await axios.post("/api/articles", articleData);

      if (response.data.success) {
        toast.success("Artikel berhasil disimpan!", {
          description: response.data.message,
        });

        // Redirect to articles list
        router.push("/dashboard/artikel");
      } else {
        throw new Error(response.data.message || "Gagal menyimpan artikel");
      }
    } catch (error) {
      console.error("Save error:", error);

      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;

        if (error.response?.status === 400) {
          // Validation errors
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
          toast.error("Gagal menyimpan artikel", {
            description:
              errorData?.message || "Terjadi kesalahan saat menyimpan",
          });
        }
      } else {
        toast.error("Gagal menyimpan artikel", {
          description:
            error instanceof Error
              ? error.message
              : "Terjadi kesalahan yang tidak terduga",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    const articleData = {
      ...formData,
      content: editorState,
      featuredImage,
      featuredImageUrl,
    };
    onPreview?.(articleData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Memuat data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Header - Responsive */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onCancel}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl xl:text-3xl font-bold leading-tight">
              {isEditing ? "Edit Artikel" : "Tambah Artikel Baru"}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              {isEditing
                ? "Perbarui artikel yang sudah ada"
                : "Buat artikel baru untuk website Desa Laiyolo Baru"}
            </p>
          </div>
        </div>

        {/* Action Buttons - Responsive */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={handlePreview}
            className="order-3 sm:order-1"
            size="sm"
            disabled={saving}
          >
            <Eye className="mr-2 h-4 w-4" />
            <span className="hidden xs:inline">Preview</span>
            <span className="xs:hidden">Preview</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSave("draft")}
            className="order-2 sm:order-2"
            size="sm"
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            <span className="hidden xs:inline">
              {saving ? "Menyimpan..." : "Simpan Draft"}
            </span>
            <span className="xs:hidden">{saving ? "Saving..." : "Draft"}</span>
          </Button>
          <Button
            onClick={() => handleSave("published")}
            className="order-1 sm:order-3"
            disabled={saving}
          >
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            <span className="hidden xs:inline">
              {saving ? "Mempublikasikan..." : "Publikasikan"}
            </span>
            <span className="xs:hidden">
              {saving ? "Publishing..." : "Publish"}
            </span>
          </Button>
        </div>
      </div>

      {/* Desktop Layout - Two Columns */}
      <div className="hidden xl:grid xl:grid-cols-3 xl:gap-6">
        {/* Main Content - 2/3 width */}
        <div className="xl:col-span-2 space-y-6">
          {/* Title & Content Card */}
          <Card>
            <CardHeader>
              <CardTitle>Konten Utama</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title-desktop">Judul Artikel *</Label>
                <Input
                  id="title-desktop"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Masukkan judul artikel..."
                  className="text-lg font-medium"
                  disabled={saving}
                />
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <Label htmlFor="excerpt-desktop">Ringkasan Artikel *</Label>
                <textarea
                  id="excerpt-desktop"
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange("excerpt", e.target.value)}
                  placeholder="Tulis ringkasan singkat artikel (max 200 karakter)..."
                  rows={4}
                  maxLength={200}
                  className="w-full px-3 py-2 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
                  disabled={saving}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {formData.excerpt.length}/200 karakter
                </p>
              </div>

              {/* Content Editor */}
              <div className="space-y-2">
                <Label>Konten Artikel *</Label>
                <div className="min-h-[500px] border border-input rounded-md [&_.EditorTheme__paragraph]:my-1 [&_.EditorTheme__heading]:my-2 [&_.EditorTheme__list]:my-1 [&_.EditorTheme__quote]:my-1">
                  <Editor
                    editorSerializedState={editorState}
                    onSerializedChange={(value) => setEditorState(value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="xl:col-span-1 space-y-6">
          {/* Publication Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pengaturan Publikasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Penulis *</Label>
                <WriterCombobox
                  writers={masterData?.writers || []}
                  value={formData.author}
                  onValueChange={(value) => handleInputChange("author", value)}
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-desktop">Kategori *</Label>
                <select
                  id="category-desktop"
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  disabled={saving}
                >
                  <option value="">Pilih kategori...</option>
                  {masterData?.categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status-desktop">Status</Label>
                <select
                  id="status-desktop"
                  value={formData.status}
                  onChange={(e) =>
                    handleInputChange(
                      "status",
                      e.target.value as "draft" | "published"
                    )
                  }
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  disabled={saving}
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
              <CardTitle className="text-lg">Gambar Unggulan</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                onChange={handleImageChange}
                onError={handleImageError}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile & Tablet Layout - Single Column */}
      <div className="xl:hidden">
        <Card>
          <CardHeader>
            <CardTitle>Form Artikel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title-mobile">Judul Artikel *</Label>
              <Input
                id="title-mobile"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Masukkan judul artikel..."
                className="text-base sm:text-lg"
                disabled={saving}
              />
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label htmlFor="excerpt-mobile">Ringkasan Artikel *</Label>
              <textarea
                id="excerpt-mobile"
                value={formData.excerpt}
                onChange={(e) => handleInputChange("excerpt", e.target.value)}
                placeholder="Tulis ringkasan singkat artikel (max 200 karakter)..."
                rows={3}
                maxLength={200}
                className="w-full px-3 py-2 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
                disabled={saving}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.excerpt.length}/200 karakter
              </p>
            </div>

            {/* Publication Settings - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Penulis *</Label>
                <WriterCombobox
                  writers={masterData?.writers || []}
                  value={formData.author}
                  onValueChange={(value) => handleInputChange("author", value)}
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-mobile">Kategori *</Label>
                <select
                  id="category-mobile"
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  disabled={saving}
                >
                  <option value="">Pilih kategori...</option>
                  {masterData?.categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <Label htmlFor="status-mobile">Status</Label>
                <select
                  id="status-mobile"
                  value={formData.status}
                  onChange={(e) =>
                    handleInputChange(
                      "status",
                      e.target.value as "draft" | "published"
                    )
                  }
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  disabled={saving}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Dipublikasi</option>
                </select>
              </div>
            </div>

            {/* Featured Image */}
            <div className="space-y-2">
              <Label>Gambar Unggulan</Label>
              <ImageUpload
                onChange={handleImageChange}
                onError={handleImageError}
              />
            </div>

            {/* Content Editor */}
            <div className="space-y-2">
              <Label>Konten Artikel *</Label>
              <div className="min-h-[350px] sm:min-h-[400px] border border-input rounded-md [&_.EditorTheme__paragraph]:my-1 [&_.EditorTheme__heading]:my-2 [&_.EditorTheme__list]:my-1 [&_.EditorTheme__quote]:my-1">
                <Editor
                  editorSerializedState={editorState}
                  onSerializedChange={(value) => setEditorState(value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
