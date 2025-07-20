"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string;
  onChange?: (file: File | null, url?: string) => void;
  onError?: (message: string) => void;
}

export function ImageUpload({ value, onChange, onError }: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    // Upload via API route
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("/api/upload-image", formData, {
        headers: {
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
    // If there's an uploaded URL, delete from Supabase first
    if (uploadedUrl) {
      setDeleting(true);
      try {
        const response = await axios.delete(`/api/delete-image`, {
          params: { url: uploadedUrl },
        });

        if (response.data.success) {
          console.log("Image deleted from Supabase");
          toast.success("Gambar berhasil dihapus!", {
            description: "Gambar telah dihapus dari server",
          });
        } else {
          console.error("Delete error:", response.data.message);
          toast.error("Gagal menghapus gambar", {
            description:
              response.data.message || "Terjadi kesalahan saat menghapus",
          });
          // Still remove from UI even if delete fails
        }
      } catch (error) {
        console.error("Delete error:", error);
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : error instanceof Error
            ? error.message
            : "Unknown error";
        console.error("Delete error details:", errorMessage);
        toast.error("Gagal menghapus gambar", {
          description: errorMessage,
        });
        // Still remove from UI even if delete fails
      } finally {
        setDeleting(false);
      }
    }

    // Remove from UI
    setPreview(null);
    setUploadedUrl(null);
    onChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label>Gambar Unggulan</Label>

      <div
        className={cn(
          "relative w-48 h-32 border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer",
          (uploading || deleting) && "cursor-not-allowed opacity-50",
          isDragOver && !uploading && !deleting
            ? "border-primary bg-primary/5 scale-105"
            : preview
              ? "border-green-200 bg-green-50"
              : "border-muted-foreground/25 bg-muted hover:border-muted-foreground/50 hover:bg-muted/80"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploading && !deleting && fileInputRef.current?.click()}
      >
        {uploading ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-2">
            <Loader2 className="h-6 w-6 animate-spin mb-2" />
            <p className="text-xs text-muted-foreground">Mengupload...</p>
          </div>
        ) : preview ? (
          <>
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <X className="h-3 w-3" />
              )}
            </Button>
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-200 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
              <div className="text-white text-xs font-medium">
                Klik untuk ganti
              </div>
            </div>
            {uploadedUrl && (
              <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-xs p-1 text-center">
                ✓ Uploaded
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-2">
            <div
              className={cn(
                "mb-2 transition-colors duration-200",
                isDragOver ? "text-primary" : "text-muted-foreground"
              )}
            >
              {isDragOver ? (
                <Upload className="h-6 w-6" />
              ) : (
                <ImageIcon className="h-6 w-6" />
              )}
            </div>
            <p
              className={cn(
                "text-xs font-medium transition-colors duration-200",
                isDragOver ? "text-primary" : "text-muted-foreground"
              )}
            >
              {isDragOver ? "Lepas untuk upload" : "Drag & drop atau klik"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Maks. 5MB</p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        disabled={uploading || deleting}
      />

      <p className="text-xs text-muted-foreground">
        Format: JPG, PNG, GIF • Maksimal 5MB
      </p>

      {uploadedUrl && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
          <p className="text-xs text-green-800 font-medium">URL Supabase:</p>
          <p className="text-xs text-green-600 break-all">{uploadedUrl}</p>
        </div>
      )}
    </div>
  );
}
