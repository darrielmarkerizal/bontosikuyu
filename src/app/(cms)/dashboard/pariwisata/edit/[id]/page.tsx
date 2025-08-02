"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Camera, Info, AlertCircle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { getAuthHeaders } from "@/lib/auth-client";
import { TravelImageUpload } from "@/components/travel/travel-image-upload";

interface Travel {
  id: number;
  name: string;
  dusun: string;
  image: string | null;
  category: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: number;
  name: string;
}

interface TravelFormData {
  name: string;
  dusun: string;
  image: string | null;
  travelCategoryId: number;
}

export default function EditPariwisataPage() {
  const router = useRouter();
  const params = useParams();
  const travelId = params.id as string;

  const [travel, setTravel] = useState<Travel | null>(null);
  const [formData, setFormData] = useState<TravelFormData>({
    name: "",
    dusun: "",
    image: null,
    travelCategoryId: 0,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dusunOptions = [
    "Dusun Laiyolo",
    "Dusun Pangkaje'ne",
    "Dusun Timoro",
    "Dusun Kilotepo",
  ];

  // Fetch travel data and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [travelResponse, categoriesResponse] = await Promise.all([
          axios.get(`/api/travels/${travelId}`, {
            headers: getAuthHeaders(),
          }),
          axios.get("/api/travel-categories", {
            headers: getAuthHeaders(),
          }),
        ]);

        if (categoriesResponse.data.success) {
          setCategories(categoriesResponse.data.data.categories || []);
        }

        if (travelResponse.data.success) {
          const travelData = travelResponse.data.data.travel;
          setTravel(travelData);

          // Set form data after categories are loaded
          setFormData({
            name: travelData.name,
            dusun: travelData.dusun,
            image: travelData.image,
            travelCategoryId: travelData.category.id,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);

        if (axios.isAxiosError(error) && error.response?.status === 401) {
          toast.error("Sesi telah berakhir", {
            description: "Silakan login kembali",
          });
          router.push("/login");
          return;
        }

        if (axios.isAxiosError(error) && error.response?.status === 404) {
          toast.error("Destinasi wisata tidak ditemukan", {
            description:
              "Destinasi wisata dengan ID tersebut tidak dapat ditemukan",
          });
          router.push("/dashboard/pariwisata");
          return;
        }

        toast.error("Gagal memuat data", {
          description: "Tidak dapat memuat data destinasi wisata",
        });
      } finally {
        setLoading(false);
      }
    };

    if (travelId) {
      fetchData();
    }
  }, [travelId, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama destinasi wisata wajib diisi";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Nama destinasi wisata minimal 3 karakter";
    }

    if (!formData.dusun) {
      newErrors.dusun = "Dusun wajib dipilih";
    }

    if (!formData.travelCategoryId) {
      newErrors.travelCategoryId = "Kategori wajib dipilih";
    }

    if (formData.image && !isValidUrl(formData.image)) {
      newErrors.image = "URL gambar tidak valid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    console.log(`Form field changed: ${field} = ${value}`);
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };
      console.log(`Updated form data:`, newData);
      return newData;
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageChange = (file: File | null, url?: string) => {
    setFormData((prev) => ({ ...prev, image: url || null }));
  };

  const handleImageError = (message: string) => {
    console.error(message);
    toast.error("Gagal mengupload gambar", {
      description: message,
    });
  };

  const handleSave = async () => {
    console.log("�� Saving travel with form data:", {
      name: formData.name,
      dusun: formData.dusun,
      categoryId: formData.travelCategoryId,
      imageLength: formData.image?.length || 0,
    });

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const travelData = {
        name: formData.name.trim(),
        dusun: formData.dusun,
        image: formData.image,
        travelCategoryId: Number(formData.travelCategoryId),
      };

      console.log("📤 Sending travel data:", travelData);

      const response = await axios.put(`/api/travels/${travelId}`, travelData, {
        headers: getAuthHeaders(),
      });

      if (response.data.success) {
        toast.success("Destinasi wisata berhasil diperbarui!", {
          description: response.data.message,
        });

        // Redirect to travels list
        router.push("/dashboard/pariwisata");
      } else {
        throw new Error(
          response.data.message || "Gagal memperbarui destinasi wisata"
        );
      }
    } catch (error) {
      console.error("Save error:", error);

      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;

        if (error.response?.status === 401) {
          toast.error("Sesi telah berakhir", {
            description: "Silakan login kembali",
          });
          router.push("/login");
          return;
        }

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
        } else if (error.response?.status === 409) {
          toast.error("Nama destinasi sudah ada", {
            description:
              errorData?.message ||
              "Nama destinasi wisata sudah ada di dusun yang sama",
          });
        } else {
          toast.error("Gagal memperbarui destinasi wisata", {
            description:
              errorData?.message || "Terjadi kesalahan saat menyimpan",
          });
        }
      } else {
        toast.error("Gagal memperbarui destinasi wisata", {
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

  if (!travel) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold">
            Destinasi Wisata Tidak Ditemukan
          </h2>
          <p className="text-muted-foreground mt-2">
            Destinasi wisata dengan ID {travelId} tidak dapat ditemukan.
          </p>
          <Button
            onClick={() => router.push("/dashboard/pariwisata")}
            className="mt-4"
          >
            Kembali ke Daftar
          </Button>
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
            onClick={() => router.push("/dashboard/pariwisata")}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl xl:text-3xl font-bold leading-tight">
              Edit Destinasi Wisata
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Perbarui informasi destinasi wisata {travel.name}
            </p>
          </div>
        </div>

        {/* Action Buttons - Responsive */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
          <Button
            onClick={handleSave}
            className="order-1 sm:order-2"
            disabled={saving}
          >
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            <span className="hidden xs:inline">
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </span>
            <span className="xs:hidden">{saving ? "Saving..." : "Simpan"}</span>
          </Button>
        </div>
      </div>

      {/* Desktop Layout - Two Columns */}
      <div className="hidden xl:grid xl:grid-cols-3 xl:gap-6">
        {/* Main Content - 2/3 width */}
        <div className="xl:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Destinasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name-desktop">Nama Destinasi Wisata *</Label>
                <Input
                  id="name-desktop"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Contoh: Pantai Bontosikuyu"
                  className="text-lg font-medium"
                  disabled={saving}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Location & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Dusun *</Label>
                  <Select
                    value={formData.dusun}
                    onValueChange={(value) => handleInputChange("dusun", value)}
                    disabled={saving}
                  >
                    <SelectTrigger
                      className={errors.dusun ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Pilih dusun" />
                    </SelectTrigger>
                    <SelectContent>
                      {dusunOptions.map((dusun) => (
                        <SelectItem key={dusun} value={dusun}>
                          {dusun}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.dusun && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.dusun}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Kategori *</Label>
                  <Select
                    value={formData.travelCategoryId.toString()}
                    onValueChange={(value) =>
                      handleInputChange("travelCategoryId", value)
                    }
                    disabled={saving}
                  >
                    <SelectTrigger
                      className={
                        errors.travelCategoryId ? "border-red-500" : ""
                      }
                    >
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.travelCategoryId && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.travelCategoryId}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="xl:col-span-1 space-y-6">
          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Gambar Destinasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TravelImageUpload
                onChange={handleImageChange}
                onError={handleImageError}
                initialImageUrl={formData.image}
              />
            </CardContent>
          </Card>

          {/* Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5" />
                Panduan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Nama destinasi harus unik di dusun yang sama</p>
              <p>• Pilih kategori yang sesuai dengan jenis wisata</p>
              <p>• Gambar akan ditampilkan di halaman wisata</p>
              <p>• Format gambar: JPG, PNG, atau GIF</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile & Tablet Layout - Single Column */}
      <div className="xl:hidden">
        <Card>
          <CardHeader>
            <CardTitle>Form Destinasi Wisata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name-mobile">Nama Destinasi Wisata *</Label>
              <Input
                id="name-mobile"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Contoh: Pantai Bontosikuyu"
                className="text-base sm:text-lg"
                disabled={saving}
              />
              {errors.name && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Location & Category - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Dusun *</Label>
                <Select
                  value={formData.dusun}
                  onValueChange={(value) => handleInputChange("dusun", value)}
                  disabled={saving}
                >
                  <SelectTrigger
                    className={errors.dusun ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Pilih dusun" />
                  </SelectTrigger>
                  <SelectContent>
                    {dusunOptions.map((dusun) => (
                      <SelectItem key={dusun} value={dusun}>
                        {dusun}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.dusun && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.dusun}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Kategori *</Label>
                <Select
                  value={formData.travelCategoryId.toString()}
                  onValueChange={(value) =>
                    handleInputChange("travelCategoryId", value)
                  }
                  disabled={saving}
                >
                  <SelectTrigger
                    className={errors.travelCategoryId ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.travelCategoryId && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.travelCategoryId}
                  </p>
                )}
              </div>
            </div>

            {/* Featured Image */}
            <div className="space-y-2">
              <Label>Gambar Destinasi</Label>
              <TravelImageUpload
                onChange={handleImageChange}
                onError={handleImageError}
                initialImageUrl={formData.image}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
