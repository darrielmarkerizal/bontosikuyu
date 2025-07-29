"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Calendar,
  User,
  FileText,
  Eye,
  Clock,
  Phone,
  MapPin,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import axios from "axios";
import { toast } from "sonner";
import { WriterDetailSkeleton } from "@/components/penulis/writer-detail-skeleton";

interface WriterDetail {
  id: number;
  fullName: string;
  phoneNumber: string;
  dusun: string;
  createdAt: string;
  updatedAt: string;
  performance: {
    totalArticles: number;
    publishedArticles: number;
    draftArticles: number;
    totalViews: number;
    averageViews: number;
    lastArticleDate: string | null;
    articlesThisMonth: number;
    articlesLastMonth: number;
    viewGrowth: number;
  };
  recentArticles: Array<{
    id: number;
    title: string;
    status: string;
    views: number;
    createdAt: string;
  }>;
}

export default function WriterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [writer, setWriter] = useState<WriterDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWriterDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/writers/${params.id}`);

        if (response.data.success) {
          setWriter(response.data.data);
        } else {
          toast.error("Gagal memuat data penulis", {
            description: response.data.message,
          });
        }
      } catch (error) {
        console.error("Error fetching writer:", error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            toast.error("Penulis tidak ditemukan");
            router.push("/dashboard/penulis");
          } else {
            toast.error("Gagal memuat data penulis", {
              description: error.response?.data?.message || error.message,
            });
          }
        } else {
          toast.error("Terjadi kesalahan", {
            description: "Gagal memuat data penulis",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchWriterDetail();
    }
  }, [params.id, router]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy 'pukul' HH:mm", {
        locale: id,
      });
    } catch {
      return "Invalid Date";
    }
  };

  const formatPhoneNumber = (phone: string) => {
    if (phone.startsWith("08")) {
      return phone.replace(/(\d{4})(\d{4})(\d+)/, "$1-$2-$3");
    }
    return phone;
  };

  const getDusunBadgeColor = (dusun: string) => {
    const colors = {
      "Dusun Pangkaje'ne": "bg-blue-50 text-blue-700 border-blue-200",
      "Dusun Laiyolo": "bg-green-50 text-green-700 border-green-200",
      "Dusun Timoro": "bg-purple-50 text-purple-700 border-purple-200",
      "Dusun Kilotepo": "bg-orange-50 text-orange-700 border-orange-200",
    };
    return (
      colors[dusun as keyof typeof colors] ||
      "bg-gray-50 text-gray-700 border-gray-200"
    );
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "text-xs font-medium";
    if (status === "published") {
      return (
        <Badge
          className={`${baseClasses} bg-green-50 text-green-700 border-green-200`}
        >
          Dipublikasi
        </Badge>
      );
    } else if (status === "draft") {
      return (
        <Badge
          className={`${baseClasses} bg-yellow-50 text-yellow-700 border-yellow-200`}
        >
          Draft
        </Badge>
      );
    } else {
      return (
        <Badge
          className={`${baseClasses} bg-gray-50 text-gray-700 border-gray-200`}
        >
          {status}
        </Badge>
      );
    }
  };

  if (loading) {
    return <WriterDetailSkeleton />;
  }

  if (!writer) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Penulis tidak ditemukan</h3>
          <p className="text-muted-foreground mb-4">
            Penulis yang Anda cari tidak dapat ditemukan.
          </p>
          <Button onClick={() => router.push("/dashboard/penulis")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Penulis
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard/penulis")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Detail Penulis</h1>
            <p className="text-muted-foreground">
              Informasi lengkap dan performa penulis
            </p>
          </div>
        </div>
        <Button
          onClick={() => router.push(`/dashboard/penulis/edit/${writer.id}`)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Penulis
        </Button>
      </div>

      {/* Writer Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informasi Penulis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Nama Lengkap
              </label>
              <p className="text-lg font-semibold">{writer.fullName}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Nomor Telepon
              </label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono">
                  {formatPhoneNumber(writer.phoneNumber)}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Dusun
              </label>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Badge
                  variant="outline"
                  className={getDusunBadgeColor(writer.dusun)}
                >
                  {writer.dusun}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Tanggal Bergabung
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(writer.createdAt)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Artikel
                </p>
                <p className="text-2xl font-bold">
                  {writer.performance.totalArticles}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Artikel Dipublikasi
                </p>
                <p className="text-2xl font-bold">
                  {writer.performance.publishedArticles}
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Artikel Draft
                </p>
                <p className="text-2xl font-bold">
                  {writer.performance.draftArticles}
                </p>
              </div>
              <FileText className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Artikel Bulan Ini
                </p>
                <p className="text-2xl font-bold">
                  {writer.performance.articlesThisMonth}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {writer.performance.viewGrowth > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span
                    className={`text-xs ${writer.performance.viewGrowth > 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {Math.abs(writer.performance.viewGrowth)}%
                  </span>
                </div>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Articles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Artikel Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent>
          {writer.recentArticles.length > 0 ? (
            <div className="space-y-3">
              {writer.recentArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{article.title}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(article.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {getStatusBadge(article.status)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        router.push(`/dashboard/artikel/${article.id}`)
                      }
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Belum ada artikel</h3>
              <p className="text-muted-foreground">
                Penulis ini belum memiliki artikel yang dipublikasikan.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
