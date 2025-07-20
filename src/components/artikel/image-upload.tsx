"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange?: (file: File | null) => void;
  onError?: (message: string) => void;
}

export function ImageUpload({ value, onChange, onError }: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      onError?.("Hanya file gambar yang diperbolehkan");
      return;
    }

    // Validate file size (5MB = 5 * 1024 * 1024 bytes)
    if (file.size > 5 * 1024 * 1024) {
      onError?.("Ukuran file maksimal 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    onChange?.(file);
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

  const handleRemove = () => {
    setPreview(null);
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
          isDragOver
            ? "border-primary bg-primary/5 scale-105"
            : preview
              ? "border-green-200 bg-green-50"
              : "border-muted-foreground/25 bg-muted hover:border-muted-foreground/50 hover:bg-muted/80"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
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
            >
              <X className="h-3 w-3" />
            </Button>
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-200 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
              <div className="text-white text-xs font-medium">
                Klik untuk ganti
              </div>
            </div>
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
      />

      <p className="text-xs text-muted-foreground">
        Format: JPG, PNG, GIF • Maksimal 5MB
      </p>
    </div>
  );
}
