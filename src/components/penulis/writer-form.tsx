"use client";

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { Writer, WriterFormData } from "./writer-types";

interface WriterFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: WriterFormData) => Promise<void>;
  writer?: Writer | null;
  loading?: boolean;
}

const dusunOptions = [
  "Dusun Laiyolo",
  "Dusun Pangkaje'ne",
  "Dusun Timoro",
  "Dusun Kilotepo",
];

export function WriterForm({
  isOpen,
  onClose,
  onSubmit,
  writer,
  loading,
}: WriterFormProps) {
  const [formData, setFormData] = useState<WriterFormData>({
    fullName: writer?.fullName || "",
    phoneNumber: writer?.phoneNumber || "",
    dusun: writer?.dusun || "",
  });

  const [errors, setErrors] = useState<Partial<WriterFormData>>({});

  const handleInputChange = (field: keyof WriterFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<WriterFormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Nama lengkap wajib diisi";
    } else if (formData.fullName.length < 2 || formData.fullName.length > 100) {
      newErrors.fullName = "Nama lengkap harus antara 2-100 karakter";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Nomor telepon wajib diisi";
    } else if (!/^\d+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Nomor telepon harus berupa angka";
    } else if (
      formData.phoneNumber.length < 10 ||
      formData.phoneNumber.length > 20
    ) {
      newErrors.phoneNumber = "Nomor telepon harus antara 10-20 digit";
    }

    if (!formData.dusun) {
      newErrors.dusun = "Dusun wajib dipilih";
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
      handleClose();
    } catch (error) {
      // Error handling is done in the parent component
      console.error("Form submission error:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      fullName: "",
      phoneNumber: "",
      dusun: "",
    });
    setErrors({});
    onClose();
  };

  // Reset form when writer changes (for edit mode)
  useState(() => {
    if (writer) {
      setFormData({
        fullName: writer.fullName,
        phoneNumber: writer.phoneNumber,
        dusun: writer.dusun,
      });
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {writer ? "Edit Penulis" : "Tambah Penulis Baru"}
          </DialogTitle>
          <DialogDescription>
            {writer
              ? "Perbarui informasi penulis yang sudah ada."
              : "Tambahkan penulis baru ke dalam sistem."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Nama Lengkap *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              placeholder="Masukkan nama lengkap..."
              disabled={loading}
              className={errors.fullName ? "border-red-500" : ""}
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Nomor Telepon *</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              placeholder="Contoh: 08123456789"
              disabled={loading}
              className={errors.phoneNumber ? "border-red-500" : ""}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Dusun */}
          <div className="space-y-2">
            <Label>Dusun *</Label>
            <Select
              value={formData.dusun}
              onValueChange={(value) => handleInputChange("dusun", value)}
              disabled={loading}
            >
              <SelectTrigger className={errors.dusun ? "border-red-500" : ""}>
                <SelectValue placeholder="Pilih dusun..." />
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
              <p className="text-sm text-red-500">{errors.dusun}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {writer ? "Mengupdate..." : "Menyimpan..."}
                </>
              ) : writer ? (
                "Update Penulis"
              ) : (
                "Simpan Penulis"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
