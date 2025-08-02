"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { getAuthHeaders } from "@/lib/auth-client";
import { toast } from "sonner";

interface TravelImageUploadProps {
  value?: string;
  onChange?: (file: File | null, url?: string) => void;
  onError?: (message: string) => void;
  initialImageUrl?: string | null;
}

export function TravelImageUpload({
  value,
  onChange,
  onError,
  initialImageUrl,
}: TravelImageUploadProps) {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(
    initialImageUrl || value || null
  );
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      const errorMsg = "File harus berupa gambar";
      onError?.(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      const errorMsg = "Ukuran file maksimal 5MB";
      onError?.(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("/api/upload-travel-image", formData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        const imageUrl = response.data.data.url;
        setUploadedUrl(imageUrl);
        onChange?.(file, imageUrl);
        toast.success("Gambar berhasil diupload");
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      let errorMessage = "Gagal mengupload gambar";

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage = "Sesi telah berakhir, silakan login kembali";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
      }

      onError?.(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!uploadedUrl) return;

    try {
      // Delete from Supabase
      await axios.delete(
        `/api/delete-image?url=${encodeURIComponent(uploadedUrl)}`,
        {
          headers: getAuthHeaders(),
        }
      );

      setUploadedUrl(null);
      onChange?.(null);
      toast.success("Gambar berhasil dihapus");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Gagal menghapus gambar");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {uploadedUrl ? (
        <div className="relative group">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
            <Image
              src={uploadedUrl}
              alt="Travel destination"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleRemove}
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Card
          className={`relative border-2 border-dashed transition-colors ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-4">
              {uploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <Camera className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">
                {uploading ? "Mengupload..." : "Upload gambar destinasi"}
              </h3>
              <p className="text-xs text-muted-foreground">
                Drag & drop atau klik untuk memilih file
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, atau GIF (maks. 5MB)
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() =>
                document.getElementById("travel-file-input")?.click()
              }
              disabled={uploading}
            >
              <Upload className="mr-2 h-4 w-4" />
              Pilih File
            </Button>
          </CardContent>
        </Card>
      )}

      <input
        id="travel-file-input"
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        disabled={uploading}
      />
    </div>
  );
}
