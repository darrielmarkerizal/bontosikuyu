"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Save,
  Loader2,
  User,
  Phone,
  MapPin,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { getAuthHeaders } from "@/lib/auth-client";

const dusunOptions = [
  "Dusun Laiyolo",
  "Dusun Pangkaje'ne",
  "Dusun Timoro",
  "Dusun Kilotepo",
];

interface WriterFormState {
  fullName: string;
  phoneNumber: string;
  dusun: string;
}

interface Writer {
  id: number;
  fullName: string;
  phoneNumber: string;
  dusun: string;
  createdAt: string;
  updatedAt: string;
}

interface WriterFormProps {
  writer?: Writer;
  isEditing?: boolean;
  onSave?: (data: WriterFormState) => Promise<void>;
  onCancel?: () => void;
}

export function WriterForm({
  writer,
  isEditing = false,
  onSave,
  onCancel,
}: WriterFormProps) {
  const [form, setForm] = useState<WriterFormState>({
    fullName: "",
    phoneNumber: "",
    dusun: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Initialize form with writer data when editing
  useEffect(() => {
    if (writer && isEditing) {
      setForm({
        fullName: writer.fullName,
        phoneNumber: writer.phoneNumber,
        dusun: writer.dusun,
      });
    }
  }, [writer, isEditing]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDusunChange = (value: string) => {
    setForm({ ...form, dusun: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing && onSave) {
        // Use the provided save function for editing
        await onSave(form);
      } else {
        // Create new writer
        await axios.post("/api/writers", form, {
          headers: getAuthHeaders(),
        });
        toast.success("Penulis berhasil ditambahkan!", {
          description: `${form.fullName} telah ditambahkan ke sistem.`,
        });
        router.push("/dashboard/penulis");
      }
    } catch (err: unknown) {
      let message = "Terjadi kesalahan tidak diketahui";
      if (axios.isAxiosError(err)) {
        const errorData = err.response?.data;

        if (err.response?.status === 400) {
          // Validation errors
          if (errorData?.errors) {
            const errorMessages = Object.values(errorData.errors)
              .filter(Boolean)
              .join(", ");
            message = errorMessages;
          } else {
            message = errorData?.message || "Data tidak lengkap";
          }
        } else if (err.response?.status === 409) {
          message = errorData?.message || "Nomor telepon sudah terdaftar";
        } else {
          message = errorData?.message || "Gagal menyimpan penulis";
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
      toast.error(
        isEditing ? "Gagal memperbarui penulis" : "Gagal menambah penulis",
        {
          description: message,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push("/dashboard/penulis");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 px-2 sm:px-4 lg:px-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleCancel}
            className="shrink-0 h-9 w-9 sm:h-10 sm:w-10"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold leading-tight">
              {isEditing ? "Edit Penulis" : "Tambah Penulis Baru"}
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mt-1">
              {isEditing
                ? "Perbarui informasi penulis yang sudah ada"
                : "Tambahkan penulis baru ke sistem Desa Laiyolo Baru"}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="hidden sm:flex text-xs">
          <Info className="h-3 w-3 mr-1" />
          Semua field wajib diisi
        </Badge>
      </div>

      {/* Form Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Form */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                Informasi Penulis
              </CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Isi data lengkap penulis dengan benar
              </p>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <form onSubmit={handleSubmit} autoComplete="off">
                {/* Nama Lengkap */}
                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="fullName" className="text-sm font-medium">
                    Nama Lengkap *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                      minLength={2}
                      maxLength={100}
                      placeholder="Masukkan nama lengkap penulis"
                      className="pl-10 text-sm sm:text-base h-10 sm:h-11"
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Minimal 2 karakter, maksimal 100 karakter
                  </p>
                </div>

                {/* Nomor Telepon */}
                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium">
                    Nomor Telepon *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      required
                      minLength={10}
                      maxLength={20}
                      pattern="[0-9]+"
                      placeholder="08xxxxxxxxxx"
                      className="pl-10 text-sm sm:text-base h-10 sm:h-11 font-mono"
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Hanya angka, minimal 10 digit, maksimal 20 digit
                  </p>
                </div>

                {/* Dusun */}
                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="dusun" className="text-sm font-medium">
                    Dusun *
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Select
                      onValueChange={handleDusunChange}
                      value={form.dusun}
                      disabled={loading}
                    >
                      <SelectTrigger className="pl-10 h-10 sm:h-11 text-sm sm:text-base">
                        <SelectValue placeholder="Pilih dusun penulis" />
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
                  <p className="text-xs text-muted-foreground">
                    Pilih dusun tempat tinggal penulis
                  </p>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="text-red-600 text-xs sm:text-sm bg-red-50 border border-red-200 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 mt-0.5 text-red-500 shrink-0" />
                      <div>
                        <p className="font-medium mb-1">Terjadi kesalahan:</p>
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={loading}
                    className="w-full sm:w-auto h-10 sm:h-11"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto flex-1 h-10 sm:h-11"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isEditing ? "Menyimpan..." : "Menyimpan..."}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {isEditing ? "Simpan Perubahan" : "Simpan Penulis"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info - Hidden on mobile, shown on tablet and up */}
        <div className="xl:col-span-1 space-y-4 hidden lg:block">
          {/* Form Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm sm:text-base">
                Status Form
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">Nama Lengkap</span>
                <Badge
                  variant={form.fullName.length >= 2 ? "default" : "secondary"}
                  className="text-xs"
                >
                  {form.fullName.length >= 2 ? "✓" : "✗"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">Nomor Telepon</span>
                <Badge
                  variant={
                    form.phoneNumber.length >= 10 ? "default" : "secondary"
                  }
                  className="text-xs"
                >
                  {form.phoneNumber.length >= 10 ? "✓" : "✗"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">Dusun</span>
                <Badge
                  variant={form.dusun ? "default" : "secondary"}
                  className="text-xs"
                >
                  {form.dusun ? "✓" : "✗"}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between font-medium">
                <span className="text-xs sm:text-sm">Form Lengkap</span>
                <Badge
                  variant={
                    form.fullName.length >= 2 &&
                    form.phoneNumber.length >= 10 &&
                    form.dusun
                      ? "default"
                      : "secondary"
                  }
                  className="text-xs"
                >
                  {form.fullName.length >= 2 &&
                  form.phoneNumber.length >= 10 &&
                  form.dusun
                    ? "Siap Disimpan"
                    : "Belum Lengkap"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Guidelines */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm sm:text-base">Panduan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs sm:text-sm text-muted-foreground">
              <div className="space-y-2">
                <p className="font-medium text-foreground">Nama Lengkap:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Gunakan nama lengkap sesuai KTP</li>
                  <li>Minimal 2 karakter</li>
                  <li>Maksimal 100 karakter</li>
                </ul>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="font-medium text-foreground">Nomor Telepon:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Hanya berisi angka</li>
                  <li>Minimal 10 digit</li>
                  <li>Maksimal 20 digit</li>
                  <li>Format: 08xxxxxxxxxx</li>
                </ul>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="font-medium text-foreground">Dusun:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Pilih dusun tempat tinggal</li>
                  <li>Data akan digunakan untuk statistik</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
