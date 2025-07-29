import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Store,
  User,
  MapPin,
  Phone,
  Image as ImageIcon,
  Info,
  AlertCircle,
} from "lucide-react";
import { Umkm, UmkmFormData } from "./umkm-types";

interface UmkmFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UmkmFormData) => Promise<void>;
  umkm: Umkm | null;
  loading: boolean;
  categories: Array<{ id: number; name: string }>;
}

export function UmkmForm({
  isOpen,
  onClose,
  onSubmit,
  umkm,
  loading,
  categories,
}: UmkmFormProps) {
  const [formData, setFormData] = useState<UmkmFormData>({
    umkmName: "",
    ownerName: "",
    umkmCategoryId: 0,
    dusun: "Dusun Laiyolo",
    phone: "",
    image: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when umkm changes
  useEffect(() => {
    if (umkm) {
      setFormData({
        umkmName: umkm.umkmName,
        ownerName: umkm.ownerName,
        umkmCategoryId: umkm.category.id,
        dusun: umkm.dusun,
        phone: umkm.phone,
        image: umkm.image || "",
      });
    } else {
      setFormData({
        umkmName: "",
        ownerName: "",
        umkmCategoryId: 0,
        dusun: "Dusun Laiyolo",
        phone: "",
        image: "",
      });
    }
    setErrors({});
  }, [umkm]);

  const handleChange = (field: keyof UmkmFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.umkmName.trim()) {
      newErrors.umkmName = "Nama UMKM wajib diisi";
    } else if (formData.umkmName.length < 2) {
      newErrors.umkmName = "Nama UMKM minimal 2 karakter";
    } else if (formData.umkmName.length > 150) {
      newErrors.umkmName = "Nama UMKM maksimal 150 karakter";
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = "Nama pemilik wajib diisi";
    } else if (formData.ownerName.length < 2) {
      newErrors.ownerName = "Nama pemilik minimal 2 karakter";
    } else if (formData.ownerName.length > 100) {
      newErrors.ownerName = "Nama pemilik maksimal 100 karakter";
    }

    if (!formData.umkmCategoryId) {
      newErrors.umkmCategoryId = "Kategori wajib dipilih";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Nomor telepon wajib diisi";
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = "Nomor telepon hanya boleh berisi angka";
    } else if (formData.phone.length < 10) {
      newErrors.phone = "Nomor telepon minimal 10 digit";
    } else if (formData.phone.length > 20) {
      newErrors.phone = "Nomor telepon maksimal 20 digit";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      // Error handling is done in the parent component
      console.error("Form submission error:", error);
    }
  };

  const dusunOptions = [
    "Dusun Laiyolo",
    "Dusun Pangkaje'ne",
    "Dusun Timoro",
    "Dusun Kilotepo",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            {umkm ? "Edit UMKM" : "Tambah UMKM Baru"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* UMKM Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-4 w-4" />
                    Informasi UMKM
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="umkmName">Nama UMKM *</Label>
                      <Input
                        id="umkmName"
                        placeholder="Masukkan nama UMKM"
                        value={formData.umkmName}
                        onChange={(e) =>
                          handleChange("umkmName", e.target.value)
                        }
                        className={errors.umkmName ? "border-red-500" : ""}
                      />
                      {errors.umkmName && (
                        <p className="text-sm text-red-500">
                          {errors.umkmName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Kategori *</Label>
                      <Select
                        value={formData.umkmCategoryId.toString()}
                        onValueChange={(value) =>
                          handleChange("umkmCategoryId", parseInt(value))
                        }
                      >
                        <SelectTrigger
                          className={
                            errors.umkmCategoryId ? "border-red-500" : ""
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
                      {errors.umkmCategoryId && (
                        <p className="text-sm text-red-500">
                          {errors.umkmCategoryId}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">URL Gambar</Label>
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="image"
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={formData.image}
                        onChange={(e) => handleChange("image", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Owner Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Informasi Pemilik
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ownerName">Nama Pemilik *</Label>
                      <Input
                        id="ownerName"
                        placeholder="Masukkan nama pemilik"
                        value={formData.ownerName}
                        onChange={(e) =>
                          handleChange("ownerName", e.target.value)
                        }
                        className={errors.ownerName ? "border-red-500" : ""}
                      />
                      {errors.ownerName && (
                        <p className="text-sm text-red-500">
                          {errors.ownerName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Nomor Telepon *</Label>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          placeholder="081234567890"
                          value={formData.phone}
                          onChange={(e) =>
                            handleChange("phone", e.target.value)
                          }
                          className={errors.phone ? "border-red-500" : ""}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-sm text-red-500">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dusun">Dusun *</Label>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <Select
                        value={formData.dusun}
                        onValueChange={(value) =>
                          handleChange("dusun", value as string)
                        }
                      >
                        <SelectTrigger>
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Form Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Status Form</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Nama UMKM</span>
                    <div
                      className={`h-2 w-2 rounded-full ${formData.umkmName ? "bg-green-500" : "bg-gray-300"}`}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Kategori</span>
                    <div
                      className={`h-2 w-2 rounded-full ${formData.umkmCategoryId ? "bg-green-500" : "bg-gray-300"}`}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Nama Pemilik</span>
                    <div
                      className={`h-2 w-2 rounded-full ${formData.ownerName ? "bg-green-500" : "bg-gray-300"}`}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Telepon</span>
                    <div
                      className={`h-2 w-2 rounded-full ${formData.phone && /^\d{10,20}$/.test(formData.phone) ? "bg-green-500" : "bg-gray-300"}`}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Dusun</span>
                    <div
                      className={`h-2 w-2 rounded-full ${formData.dusun ? "bg-green-500" : "bg-gray-300"}`}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Guidelines */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Panduan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="space-y-2">
                    <p className="font-medium">Nama UMKM:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Minimal 2 karakter</li>
                      <li>Maksimal 150 karakter</li>
                      <li>Gunakan nama yang jelas dan mudah diingat</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <p className="font-medium">Kategori:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Pilih kategori yang sesuai dengan jenis usaha</li>
                      <li>Kategori membantu pengunjung menemukan UMKM</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <p className="font-medium">Nomor Telepon:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Hanya berisi angka (0-9)</li>
                      <li>Minimal 10 digit</li>
                      <li>Maksimal 20 digit</li>
                      <li>Contoh: 081234567890</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <p className="font-medium">URL Gambar:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Opsional - untuk menampilkan foto UMKM</li>
                      <li>Gunakan URL gambar yang valid</li>
                      <li>Format: https://example.com/image.jpg</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Warning */}
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2 text-yellow-800">
                    <AlertCircle className="h-4 w-4" />
                    Perhatian
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-yellow-700">
                  <p>
                    Pastikan semua informasi yang dimasukkan sudah benar dan
                    akurat. Data UMKM akan ditampilkan kepada pengunjung website
                    desa.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-2 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {umkm ? "Menyimpan..." : "Membuat..."}
                </>
              ) : umkm ? (
                "Simpan Perubahan"
              ) : (
                "Buat UMKM"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
