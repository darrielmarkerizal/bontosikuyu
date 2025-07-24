import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Eye, Camera } from "lucide-react";
import Image from "next/image";

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

interface WisataGridProps {
  travels: Travel[];
  onTravelClick: (travel: Travel) => void;
  loading: boolean;
}

export function WisataGrid({
  travels,
  onTravelClick,
  loading,
}: WisataGridProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // No loading state - just return empty or content
  if (loading || travels.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {travels.map((travel) => (
        <Card
          key={travel.id}
          className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer bg-white"
          onClick={() => onTravelClick(travel)}
        >
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {travel.image ? (
              <Image
                src={travel.image}
                alt={travel.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Camera className="h-8 w-8 text-gray-400 mx-auto" />
                  <span className="text-sm text-gray-500 font-plus-jakarta-sans">
                    Tidak ada gambar
                  </span>
                </div>
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Category badge */}
            <div className="absolute top-3 right-3">
              <Badge className="bg-white/90 text-gray-900 hover:bg-white font-plus-jakarta-sans">
                {travel.category.name}
              </Badge>
            </div>

            {/* View button overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="sm"
                className="bg-white text-gray-900 hover:bg-white/90 font-plus-jakarta-sans"
              >
                <Eye className="h-4 w-4 mr-2" />
                Lihat Detail
              </Button>
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-4 space-y-3">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-brand-primary transition-colors font-sentient">
                {travel.name}
              </h3>

              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="truncate font-plus-jakarta-sans">
                  {travel.dusun.replace("Dusun ", "")}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="h-3 w-3 flex-shrink-0" />
                <span className="font-plus-jakarta-sans">
                  {formatDate(travel.createdAt)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
