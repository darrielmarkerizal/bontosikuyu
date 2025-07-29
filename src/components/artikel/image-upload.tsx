"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";
import { getAuthHeaders } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface ImageUploadProps {
  value?: string;
  onChange?: (file: File | null, url?: string) => void;
  onError?: (message: string) => void;
  initialImageUrl?: string | null;
}

export function ImageUpload({
  value,
  onChange,
  onError,
  initialImageUrl,
}: ImageUploadProps) {
  const router = useRouter();
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    value || initialImageUrl || null
  );
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(
    value || initialImageUrl || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview and uploadedUrl when initialImageUrl changes
  useEffect(() => {
    if (initialImageUrl) {
      setPreview(initialImageUrl);
      setUploadedUrl(initialImageUrl);
    }
  }, [initialImageUrl]);

  const handleFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      onError?.("Hanya file gambar yang diperbolehkan");
      toast.error("Format file tidak valid", {
        description: "Hanya file gambar yang diperbolehkan",
      });
      return;
    }

    // Validate file size (5MB = 5 * 1024 * 1024 bytes)
    if (file.size > 5 * 1024 * 1024) {
      onError?.("Ukuran file maksimal 5MB");
      toast.error("Ukuran file terlalu besar", {
        description: "Ukuran file maksimal 5MB",
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload via API route with authentication
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("/api/upload-image", formData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setUploadedUrl(response.data.data.url);
        onChange?.(file, response.data.data.url);
        toast.success("Gambar berhasil diupload!", {
          description: "Gambar telah disimpan ke server",
        });
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Sesi telah berakhir", {
          description: "Silakan login kembali",
        });
        router.push("/login");
        return;
      }

      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : error instanceof Error
          ? error.message
          : "Unknown error";
      onError?.(`Gagal upload gambar: ${errorMessage}`);
      toast.error("Gagal upload gambar", {
        description: errorMessage,
      });
      // Remove preview if upload failed
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleRemove = async () => {
    if (!uploadedUrl) {
      setPreview(null);
      setUploadedUrl(null);
      onChange?.(null);
      return;
    }

    setDeleting(true);
    try {
      // Extract filename from URL
      const urlParts = uploadedUrl.split("/");
      const filename = urlParts[urlParts.length - 1];

      await axios.delete("/api/delete-image", {
        headers: getAuthHeaders(),
        data: { filename },
      });

      setPreview(null);
      setUploadedUrl(null);
      onChange?.(null);
      toast.success("Gambar berhasil dihapus!");
    } catch (error) {
      console.error("Delete error:", error);

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Sesi telah berakhir", {
          description: "Silakan login kembali",
        });
        router.push("/login");
        return;
      }

      toast.error("Gagal menghapus gambar", {
        description: "Gambar mungkin masih digunakan di tempat lain",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Preview */}
      {preview && (
        <div className="relative">
          <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden border">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleRemove}
            disabled={deleting}
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}

      {/* Upload Area */}
      {!preview && (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 text-center transition-colors",
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />

          <div className="space-y-2">
            {uploading ? (
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
            ) : (
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
            )}
            <div>
              <Label className="text-sm font-medium cursor-pointer">
                {uploading
                  ? "Mengupload..."
                  : "Klik untuk upload atau drag & drop"}
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, GIF hingga 5MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Button (when preview exists) */}
      {preview && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full"
        >
          <ImageIcon className="mr-2 h-4 w-4" />
          {uploading ? "Mengupload..." : "Ganti Gambar"}
        </Button>
      )}
    </div>
  );
}
