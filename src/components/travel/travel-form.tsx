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
import { MapPin, Camera, Info, AlertCircle } from "lucide-react";

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

type TravelFormData = {
  name: string;
  dusun: string;
  image: string | null;
  travelCategoryId: number;
};

interface TravelFormProps {
  open: boolean;
  travel: Travel | null;
  categories: Category[];
  onClose: () => void;
  onSubmit: (data: TravelFormData) => void;
}

export function TravelForm({
  open,
  travel,
  categories,
  onClose,
  onSubmit,
}: TravelFormProps) {
  const [formData, setFormData] = useState<TravelFormData>({
    name: "",
    dusun: "",
    image: "",
    travelCategoryId: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dusunOptions = [
    "Dusun Laiyolo",
    "Dusun Pangkaje'ne",
    "Dusun Timoro",
    "Dusun Kilotepo",
  ];

  useEffect(() => {
    if (travel) {
      setFormData({
        name: travel.name,
        dusun: travel.dusun,
        image: travel.image || null,
        travelCategoryId: travel.category.id,
      });
    } else {
      setFormData({
        name: "",
        dusun: "",
        image: null,
        travelCategoryId: 0,
      });
    }
    setErrors({});
  }, [travel, open]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: formData.name.trim(),
        dusun: formData.dusun,
        image: formData.image?.trim() || null,
        travelCategoryId: Number(formData.travelCategoryId),
      });
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {travel ? "Edit Destinasi Wisata" : "Tambah Destinasi Wisata"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Main Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Destinasi Wisata *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Contoh: Pantai Bontosikuyu"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dusun">Dusun *</Label>
                <Select
                  value={formData.dusun}
                  onValueChange={(value) => handleChange("dusun", value)}
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
                <Label htmlFor="category">Kategori *</Label>
                <Select
                  value={formData.travelCategoryId.toString()}
                  onValueChange={(value) =>
                    handleChange("travelCategoryId", value)
                  }
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

              <div className="space-y-2">
                <Label htmlFor="image">URL Gambar</Label>
                <Input
                  id="image"
                  value={formData.image || ""}
                  onChange={(e) => handleChange("image", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className={errors.image ? "border-red-500" : ""}
                />
                {errors.image && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.image}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Masukkan URL gambar yang valid (opsional)
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Form Status */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Status Form
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Nama Destinasi:</span>
                    <span
                      className={
                        formData.name ? "text-green-600" : "text-red-500"
                      }
                    >
                      {formData.name ? "✓" : "✗"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Dusun:</span>
                    <span
                      className={
                        formData.dusun ? "text-green-600" : "text-red-500"
                      }
                    >
                      {formData.dusun ? "✓" : "✗"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Kategori:</span>
                    <span
                      className={
                        formData.travelCategoryId
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    >
                      {formData.travelCategoryId ? "✓" : "✗"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Gambar:</span>
                    <span
                      className={
                        formData.image ? "text-green-600" : "text-gray-500"
                      }
                    >
                      {formData.image ? "✓" : "Opsional"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Guidelines */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Panduan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-muted-foreground">
                  <p>• Nama destinasi harus unik di dusun yang sama</p>
                  <p>• Pilih kategori yang sesuai dengan jenis wisata</p>
                  <p>• URL gambar harus dapat diakses publik</p>
                  <p>• Gambar akan ditampilkan di halaman wisata</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : travel ? "Perbarui" : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
