import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, X, ExternalLink, Camera } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";

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

interface RelatedTravel {
  id: number;
  name: string;
  dusun: string;
  image: string | null;
  category: {
    id: number;
    name: string;
  };
}

interface TravelDetailResponse {
  success: boolean;
  message: string;
  data: {
    travel: Travel;
    relatedTravels: RelatedTravel[];
  };
}

interface WisataDetailModalProps {
  travel: Travel | null;
  open: boolean;
  onClose: () => void;
}

export function WisataDetailModal({
  travel,
  open,
  onClose,
}: WisataDetailModalProps) {
  const [travelDetail, setTravelDetail] = useState<Travel | null>(null);
  const [relatedTravels, setRelatedTravels] = useState<RelatedTravel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && travel) {
      fetchTravelDetail(travel.id);
    }
  }, [open, travel]);

  const fetchTravelDetail = async (travelId: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<TravelDetailResponse>(
        `/api/travels/${travelId}`
      );

      if (response.data.success) {
        setTravelDetail(response.data.data.travel);
        setRelatedTravels(response.data.data.relatedTravels || []);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching travel detail:", error);

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        setError(errorMessage);
        toast.error("Gagal memuat detail wisata", {
          description: errorMessage,
        });
      } else {
        const errorMessage = "Terjadi kesalahan yang tidak terduga";
        setError(errorMessage);
        toast.error("Terjadi kesalahan", {
          description: errorMessage,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleRelatedTravelClick = (relatedTravel: RelatedTravel) => {
    fetchTravelDetail(relatedTravel.id);
  };

  const handleShare = async () => {
    if (!travelDetail) return;

    const shareData = {
      title: `${travelDetail.name} - Wisata Laiyolo Baru`,
      text: `Kunjungi ${travelDetail.name} di ${travelDetail.dusun}, Desa Laiyolo Baru`,
      url: `${window.location.origin}/wisata?highlight=${travelDetail.id}`,
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        toast.success("Berhasil dibagikan");
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link berhasil disalin ke clipboard");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Gagal membagikan link");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        {/* Fixed Header */}
        <DialogHeader className="px-6 py-4 border-b bg-white rounded-t-lg">
          <DialogTitle className="flex items-center justify-between font-sentient">
            <span>Detail Wisata</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1">
          <div className="px-6 py-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="space-y-4">
                  <div className="text-4xl">😕</div>
                  <h3 className="text-lg font-semibold text-gray-900 font-sentient">
                    Gagal Memuat Detail
                  </h3>
                  <p className="text-gray-600 font-plus-jakarta-sans">
                    {error}
                  </p>
                  <Button
                    onClick={() => travel && fetchTravelDetail(travel.id)}
                    size="sm"
                  >
                    Coba Lagi
                  </Button>
                </div>
              </div>
            ) : travelDetail ? (
              <div className="space-y-6">
                {/* Main Image */}
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                  {travelDetail.image ? (
                    <Image
                      src={travelDetail.image}
                      alt={travelDetail.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 896px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <Camera className="h-12 w-12 text-gray-400 mx-auto" />
                        <span className="text-gray-500 font-plus-jakarta-sans">
                          Tidak ada gambar
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Travel Info */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="space-y-2">
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-sentient">
                        {travelDetail.name}
                      </h1>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span className="font-plus-jakarta-sans">
                            {travelDetail.dusun}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span className="font-plus-jakarta-sans">
                            Ditambahkan {formatDate(travelDetail.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Badge className="w-fit font-plus-jakarta-sans">
                      {travelDetail.category.name}
                    </Badge>
                  </div>

                  {/* Description */}
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed font-plus-jakarta-sans">
                      Temukan keindahan {travelDetail.name} yang berada di{" "}
                      {travelDetail.dusun}. Destinasi wisata{" "}
                      {travelDetail.category.name.toLowerCase()} ini menawarkan
                      pengalaman yang tak terlupakan dengan pemandangan yang
                      menakjubkan dan kekayaan budaya lokal yang autentik.
                    </p>
                  </div>
                </div>

                {/* Related Travels */}
                {relatedTravels.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 font-sentient">
                      Wisata Lainnya di {travelDetail.dusun}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {relatedTravels.map((relatedTravel) => (
                        <div
                          key={relatedTravel.id}
                          className="group cursor-pointer bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                          onClick={() =>
                            handleRelatedTravelClick(relatedTravel)
                          }
                        >
                          <div className="relative aspect-[4/3]">
                            {relatedTravel.image ? (
                              <Image
                                src={relatedTravel.image}
                                alt={relatedTravel.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                <Camera className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>

                          <div className="p-3 space-y-1">
                            <h4 className="font-medium text-sm text-gray-900 line-clamp-1 group-hover:text-brand-primary transition-colors font-sentient">
                              {relatedTravel.name}
                            </h4>
                            <Badge
                              variant="outline"
                              className="text-xs font-plus-jakarta-sans"
                            >
                              {relatedTravel.category.name}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Button
                    className="flex-1 font-plus-jakarta-sans"
                    onClick={() => {
                      toast.info("Fitur navigasi akan segera tersedia");
                    }}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Lihat di Peta
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1 font-plus-jakarta-sans"
                    onClick={handleShare}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Bagikan
                  </Button>
                </div>

                {/* Spacing at bottom for better scroll experience */}
                <div className="h-4" />
              </div>
            ) : null}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
