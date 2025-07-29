"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  User,
  Calendar,
  ExternalLink,
  Store,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import { useState } from "react";

interface Umkm {
  id: number;
  umkmName: string;
  ownerName: string;
  dusun: string;
  phone: string;
  image?: string;
  category: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface UmkmGridProps {
  umkmList: Umkm[];
  loading: boolean;
  error: string | null;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

// Loading skeleton component
function UmkmCardSkeleton() {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="h-48 bg-gray-200"></div>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-9 bg-gray-200 rounded w-24"></div>
        </div>
      </CardContent>
    </Card>
  );
}

// Individual UMKM card component
function UmkmCard({ umkm }: { umkm: Umkm }) {
  const [imageError, setImageError] = useState(false);
  const fallbackImage =
    "https://images.unsplash.com/photo-1556909114-8ba9e6b4c9e9?w=500&h=300&fit=crop&auto=format";

  const handleCallPhone = () => {
    window.open(`tel:${umkm.phone}`, "_self");
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: id });
    } catch {
      return "Tanggal tidak valid";
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {umkm.image && !imageError ? (
          <>
            <Image
              src={umkm.image}
              alt={`Foto ${umkm.umkmName}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={handleImageError}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </>
        ) : (
          <>
            {imageError && umkm.image ? (
              <>
                <Image
                  src={fallbackImage}
                  alt={`Foto default untuk ${umkm.umkmName}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center">
                <Store className="h-16 w-16 text-brand-primary/30" />
              </div>
            )}
          </>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-white/90 text-brand-secondary border-0 font-plus-jakarta-sans">
            {umkm.category.name}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-brand-secondary font-sentient line-clamp-2 group-hover:text-brand-primary transition-colors">
            {umkm.umkmName}
          </h3>
          <div className="flex items-center gap-2 text-gray-600">
            <User className="h-4 w-4" />
            <span className="text-sm font-plus-jakarta-sans">
              {umkm.ownerName}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-plus-jakarta-sans">
              {umkm.dusun.replace("Dusun ", "")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="h-4 w-4" />
            <span className="text-sm font-plus-jakarta-sans">{umkm.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-plus-jakarta-sans">
              Bergabung {formatDate(umkm.createdAt)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleCallPhone}
            className="flex-1 bg-brand-primary hover:bg-brand-primary/90 text-brand-secondary font-plus-jakarta-sans"
          >
            <Phone className="h-4 w-4 mr-2" />
            Hubungi
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function UmkmGrid({
  umkmList,
  loading,
  error,
  hasActiveFilters,
  onResetFilters,
}: UmkmGridProps) {
  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <UmkmCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2 font-sentient">
          Terjadi Kesalahan
        </h3>
        <p className="text-gray-600 mb-6 font-plus-jakarta-sans max-w-md mx-auto">
          {error}
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-brand-primary hover:bg-brand-primary/90 text-brand-secondary font-plus-jakarta-sans"
        >
          Muat Ulang Halaman
        </Button>
      </div>
    );
  }

  // Empty state
  if (umkmList.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Store className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2 font-sentient">
          Tidak Ada UMKM Ditemukan
        </h3>
        <p className="text-gray-600 mb-6 font-plus-jakarta-sans max-w-md mx-auto">
          {hasActiveFilters
            ? "Coba ubah filter pencarian untuk menemukan UMKM yang sesuai"
            : "Belum ada UMKM yang terdaftar saat ini"}
        </p>
        {hasActiveFilters && (
          <Button
            onClick={onResetFilters}
            variant="outline"
            className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-plus-jakarta-sans"
          >
            Reset Filter
          </Button>
        )}
      </div>
    );
  }

  // Success state - show UMKM cards
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {umkmList.map((umkm) => (
        <UmkmCard key={umkm.id} umkm={umkm} />
      ))}
    </div>
  );
}
