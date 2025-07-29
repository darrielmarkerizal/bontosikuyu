"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  Users,
  FileText,
  Store,
  MapPin,
  Eye,
  TrendingUp,
  TrendingDown,
  Smartphone,
  Monitor,
  Tablet,
  Clock,
  User,
  Building2,
  Globe,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Shield,
  Database,
} from "lucide-react";
import { toast } from "sonner";

interface DashboardData {
  overview: {
    totalArticles: number;
    totalUmkm: number;
    totalTravels: number;
    totalWriters: number;
    totalUsers: number;
    totalSessions: number;
    totalPageViews: number;
    activeSessions: number;
  };
  recentActivity: {
    recentArticles: Array<{
      id: number;
      title: string;
      status: string;
      createdAt: string;
      writerName: string;
    }>;
    recentUmkm: Array<{
      id: number;
      umkmName: string;
      ownerName: string;
      dusun: string;
      createdAt: string;
    }>;
    recentTravels: Array<{
      id: number;
      name: string;
      dusun: string;
      createdAt: string;
    }>;
    recentWriters: Array<{
      id: number;
      fullName: string;
      dusun: string;
      createdAt: string;
    }>;
    recentLogs: Array<{
      id: number;
      action: string;
      description: string;
      tableName: string;
      recordId: number | null;
      userId: number | null;
      ipAddress: string | null;
      createdAt: string;
    }>;
  };
  quickStats: {
    articlesByStatus: {
      published: number;
      draft: number;
    };
    umkmByDusun: Record<string, number>;
    travelsByDusun: Record<string, number>;
    writersByDusun: Record<string, number>;
    topPerformingArticles: Array<{
      id: number;
      title: string;
      pageViews: number;
    }>;
  };
  trafficInsights: {
    todayStats: {
      sessions: number;
      pageViews: number;
      uniqueVisitors: number;
    };
    weeklyGrowth: {
      sessions: number;
      pageViews: number;
    };
    deviceBreakdown: {
      mobile: number;
      desktop: number;
      tablet: number;
    };
    topPages: Array<{
      page: string;
      views: number;
    }>;
  };
  lastUpdated: string;
}

interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: DashboardData;
  user: User;
  performance?: {
    queryTime: string;
    optimized: boolean;
  };
  timestamp: string;
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<ApiResponse>("/api/dashboard", {
        withCredentials: true,
        timeout: 10000,
      });

      const { data } = response;

      if (data.success) {
        setDashboardData(data.data);
        setUser(data.user);

        if (process.env.NODE_ENV === "development" && data.performance) {
          console.log(`Dashboard loaded in ${data.performance.queryTime}`);
        }
      } else {
        throw new Error(data.message || "Gagal mengambil data dashboard");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);

      let errorMessage = "Terjadi kesalahan saat mengambil data";

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage = "Sesi telah berakhir. Silakan login kembali.";
        } else if (error.response?.status === 403) {
          errorMessage = "Anda tidak memiliki akses ke dashboard ini.";
        } else if (error.response?.status === 500) {
          errorMessage = "Terjadi kesalahan pada server.";
        } else if (error.code === "ECONNABORTED") {
          errorMessage = "Koneksi timeout. Silakan coba lagi.";
        } else if (error.code === "NETWORK_ERROR") {
          errorMessage = "Tidak dapat terhubung ke server.";
        } else {
          errorMessage =
            error.response?.data?.message || error.message || errorMessage;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      toast.error("Error", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getGrowthIcon = (value: number) => {
    return value >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (status: string) => {
    return status === "publish" ? (
      <Badge
        variant="default"
        className="bg-green-100 text-green-800 hover:bg-green-100"
      >
        Published
      </Badge>
    ) : (
      <Badge
        variant="secondary"
        className="bg-gray-100 text-gray-800 hover:bg-gray-100"
      >
        Draft
      </Badge>
    );
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "CREATE":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "UPDATE":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "DELETE":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "LOGIN":
        return <User className="h-4 w-4 text-green-500" />;
      case "LOGOUT":
        return <User className="h-4 w-4 text-gray-500" />;
      case "VIEW":
        return <Eye className="h-4 w-4 text-blue-500" />;
      case "DOWNLOAD":
        return <Database className="h-4 w-4 text-purple-500" />;
      case "UPLOAD":
        return <Shield className="h-4 w-4 text-orange-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getActionBadge = (action: string) => {
    const baseClasses = "text-xs font-medium px-2 py-1 rounded-full";

    switch (action) {
      case "CREATE":
        return (
          <Badge className={`${baseClasses} bg-green-100 text-green-800`}>
            CREATE
          </Badge>
        );
      case "UPDATE":
        return (
          <Badge className={`${baseClasses} bg-blue-100 text-blue-800`}>
            UPDATE
          </Badge>
        );
      case "DELETE":
        return (
          <Badge className={`${baseClasses} bg-red-100 text-red-800`}>
            DELETE
          </Badge>
        );
      case "LOGIN":
        return (
          <Badge className={`${baseClasses} bg-green-100 text-green-800`}>
            LOGIN
          </Badge>
        );
      case "LOGOUT":
        return (
          <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>
            LOGOUT
          </Badge>
        );
      case "VIEW":
        return (
          <Badge className={`${baseClasses} bg-blue-100 text-blue-800`}>
            VIEW
          </Badge>
        );
      case "DOWNLOAD":
        return (
          <Badge className={`${baseClasses} bg-purple-100 text-purple-800`}>
            DOWNLOAD
          </Badge>
        );
      case "UPLOAD":
        return (
          <Badge className={`${baseClasses} bg-orange-100 text-orange-800`}>
            UPLOAD
          </Badge>
        );
      default:
        return (
          <Badge className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            {action}
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[...Array(5)].map((_, j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-red-600">{error}</p>
              <Button onClick={fetchDashboardData}>Coba Lagi</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!dashboardData) return null;

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Selamat datang, {user?.fullName || user?.username}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            Terakhir diperbarui: {formatDate(dashboardData.lastUpdated)}
          </span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Artikel</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(dashboardData.overview.totalArticles)}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.quickStats.articlesByStatus.published} published,{" "}
              {dashboardData.quickStats.articlesByStatus.draft} draft
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total UMKM</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(dashboardData.overview.totalUmkm)}
            </div>
            <p className="text-xs text-muted-foreground">
              {Object.keys(dashboardData.quickStats.umkmByDusun).length} dusun
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wisata</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(dashboardData.overview.totalTravels)}
            </div>
            <p className="text-xs text-muted-foreground">
              {Object.keys(dashboardData.quickStats.travelsByDusun).length}{" "}
              dusun
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Penulis</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(dashboardData.overview.totalWriters)}
            </div>
            <p className="text-xs text-muted-foreground">
              {Object.keys(dashboardData.quickStats.writersByDusun).length}{" "}
              dusun
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sesi Hari Ini</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(dashboardData.trafficInsights.todayStats.sessions)}
            </div>
            <div className="flex items-center gap-1 text-xs">
              {getGrowthIcon(
                dashboardData.trafficInsights.weeklyGrowth.sessions
              )}
              <span
                className={
                  dashboardData.trafficInsights.weeklyGrowth.sessions >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {Math.abs(
                  dashboardData.trafficInsights.weeklyGrowth.sessions
                ).toFixed(1)}
                %
              </span>
              <span className="text-muted-foreground">dari minggu lalu</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tayangan Hari Ini
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(dashboardData.trafficInsights.todayStats.pageViews)}
            </div>
            <div className="flex items-center gap-1 text-xs">
              {getGrowthIcon(
                dashboardData.trafficInsights.weeklyGrowth.pageViews
              )}
              <span
                className={
                  dashboardData.trafficInsights.weeklyGrowth.pageViews >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {Math.abs(
                  dashboardData.trafficInsights.weeklyGrowth.pageViews
                ).toFixed(1)}
                %
              </span>
              <span className="text-muted-foreground">dari minggu lalu</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pengunjung Unik
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(
                dashboardData.trafficInsights.todayStats.uniqueVisitors
              )}
            </div>
            <p className="text-xs text-muted-foreground">Hari ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sesi Aktif</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(dashboardData.overview.activeSessions)}
            </div>
            <p className="text-xs text-muted-foreground">Saat ini</p>
          </CardContent>
        </Card>
      </div>

      {/* Device Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Breakdown Perangkat
          </CardTitle>
          <CardDescription>
            Distribusi pengunjung berdasarkan jenis perangkat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <Smartphone className="h-8 w-8 text-blue-500" />
              <div>
                <p className="font-medium">Mobile</p>
                <p className="text-2xl font-bold">
                  {formatNumber(
                    dashboardData.trafficInsights.deviceBreakdown.mobile
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <Monitor className="h-8 w-8 text-green-500" />
              <div>
                <p className="font-medium">Desktop</p>
                <p className="text-2xl font-bold">
                  {formatNumber(
                    dashboardData.trafficInsights.deviceBreakdown.desktop
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <Tablet className="h-8 w-8 text-orange-500" />
              <div>
                <p className="font-medium">Tablet</p>
                <p className="text-2xl font-bold">
                  {formatNumber(
                    dashboardData.trafficInsights.deviceBreakdown.tablet
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Articles Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Artikel Terbaru
            </CardTitle>
            <CardDescription>
              Daftar artikel terbaru yang ditambahkan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul</TableHead>
                    <TableHead>Penulis</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData.recentActivity.recentArticles.map(
                    (article) => (
                      <TableRow key={article.id}>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {article.title}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {article.writerName}
                        </TableCell>
                        <TableCell>{getStatusBadge(article.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(article.createdAt)}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* UMKM Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              UMKM Terbaru
            </CardTitle>
            <CardDescription>
              Daftar UMKM terbaru yang didaftarkan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama UMKM</TableHead>
                    <TableHead>Pemilik</TableHead>
                    <TableHead>Dusun</TableHead>
                    <TableHead>Tanggal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData.recentActivity.recentUmkm.map((umkm) => (
                    <TableRow key={umkm.id}>
                      <TableCell className="font-medium max-w-[150px] truncate">
                        {umkm.umkmName}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {umkm.ownerName}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {umkm.dusun}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(umkm.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Travel Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Destinasi Wisata Terbaru
          </CardTitle>
          <CardDescription>
            Daftar destinasi wisata terbaru yang ditambahkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Destinasi</TableHead>
                  <TableHead>Dusun</TableHead>
                  <TableHead>Tanggal Ditambahkan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData.recentActivity.recentTravels.map((travel) => (
                  <TableRow key={travel.id}>
                    <TableCell className="font-medium">{travel.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {travel.dusun}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(travel.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity and Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Writers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Penulis Terbaru
            </CardTitle>
            <CardDescription>Penulis yang baru bergabung</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentActivity.recentWriters.map((writer) => (
                <div
                  key={writer.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div>
                    <h4 className="font-medium text-sm">{writer.fullName}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Building2 className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {writer.dusun}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(writer.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Aktivitas Terbaru
            </CardTitle>
            <CardDescription>Log aktivitas sistem terbaru</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentActivity.recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-3 rounded-lg border"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getActionIcon(log.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getActionBadge(log.action)}
                      <span className="text-xs text-muted-foreground">
                        {log.tableName}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{log.description}</p>
                    {log.ipAddress && (
                      <p className="text-xs text-muted-foreground mt-1">
                        IP: {log.ipAddress}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0 text-xs text-muted-foreground">
                    {formatDate(log.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages and Dusun Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Halaman Terpopuler
            </CardTitle>
            <CardDescription>
              5 halaman dengan tayangan tertinggi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.trafficInsights.topPages.map((page, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">
                      {page.page}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Halaman website
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {formatNumber(page.views)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dusun Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Distribusi UMKM per Dusun
            </CardTitle>
            <CardDescription>Jumlah UMKM berdasarkan dusun</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(dashboardData.quickStats.umkmByDusun).map(
                ([dusun, count]) => (
                  <div
                    key={dusun}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-sm">{dusun}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{count}</span>
                      <span className="text-xs text-muted-foreground">
                        UMKM
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
