"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Clock } from "lucide-react";
import { toast } from "sonner";
import {
  OverviewCards,
  TrafficOverview,
  DeviceBreakdown,
  DataTables,
  TravelTable,
  WritersAndLogs,
  PagesAndDusun,
  DashboardLoadingSkeleton,
  ErrorState,
  formatDate,
  type DashboardData,
  type User,
  type ApiResponse,
} from "@/components/dashboard";

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

  if (loading) {
    return <DashboardLoadingSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchDashboardData} />;
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
      <OverviewCards data={dashboardData} />

      {/* Traffic Overview */}
      <TrafficOverview data={dashboardData} />

      {/* Device Breakdown */}
      <DeviceBreakdown data={dashboardData} />

      {/* Data Tables */}
      <DataTables data={dashboardData} />

      {/* Travel Table */}
      <TravelTable data={dashboardData} />

      {/* Writers and Logs */}
      <WritersAndLogs data={dashboardData} />

      {/* Pages and Dusun */}
      <PagesAndDusun data={dashboardData} />
    </div>
  );
}
