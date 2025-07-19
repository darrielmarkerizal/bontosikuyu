"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Calendar, Users, Eye, Clock, MapPin } from "lucide-react";

const stats = {
  artikel: {
    total: 45,
    bulanIni: 8,
    trending: +12,
  },
  event: {
    total: 12,
    bulanIni: 3,
    trending: +5,
  },
  penulis: {
    total: 8,
    aktif: 6,
    trending: +2,
  },
  views: {
    total: 1250,
    bulanIni: 450,
    trending: +18,
  },
};

const recentArticles = [
  {
    id: 1,
    title: "Peningkatan Infrastruktur Jalan di Bontosikuyu",
    author: "Budi Santoso",
    date: "2024-01-15",
    views: 125,
  },
  {
    id: 2,
    title: "Festival Budaya Selayar 2024",
    author: "Siti Aminah",
    date: "2024-01-14",
    views: 89,
  },
  {
    id: 3,
    title: "Program Bantuan UMKM Kecamatan",
    author: "Ahmad Hidayat",
    date: "2024-01-13",
    views: 167,
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: "Rapat Koordinasi Desa",
    date: "2024-01-20",
    location: "Kantor Kecamatan",
  },
  {
    id: 2,
    title: "Sosialisasi Program KB",
    date: "2024-01-22",
    location: "Balai Desa Bonto",
  },
  {
    id: 3,
    title: "Gotong Royong Pembersihan Pantai",
    date: "2024-01-25",
    location: "Pantai Bira",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Selamat Datang</h1>
        <p className="text-muted-foreground">
          Mari kelola konten untuk kemajuan Desa Laiyolo Baru.
        </p>
      </div>

      {/* Statistik Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Artikel</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.artikel.total}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats.artikel.bulanIni}</span>{" "}
              artikel bulan ini
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Event</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.event.total}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats.event.bulanIni}</span>{" "}
              event bulan ini
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Penulis Aktif</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.penulis.aktif}</div>
            <p className="text-xs text-muted-foreground">
              dari {stats.penulis.total} total penulis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.views.total.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats.views.trending}%</span>{" "}
              dari bulan lalu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Content */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Articles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Artikel Terbaru
            </CardTitle>
            <CardDescription>Artikel yang baru dipublikasikan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentArticles.map((article) => (
              <div
                key={article.id}
                className="flex items-start justify-between space-x-4"
              >
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium leading-none">
                    {article.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    oleh {article.author}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {article.views} views
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Event Mendatang
            </CardTitle>
            <CardDescription>Jadwal kegiatan yang akan datang</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {event.title}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {event.location}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
          <CardDescription>
            Akses cepat ke fitur yang sering digunakan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <a
              href="/dashboard/artikel"
              className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors"
            >
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium">Kelola Artikel</p>
                <p className="text-sm text-muted-foreground">
                  Buat dan edit artikel
                </p>
              </div>
            </a>

            <a
              href="/dashboard/event"
              className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors"
            >
              <Calendar className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium">Kelola Event</p>
                <p className="text-sm text-muted-foreground">
                  Buat dan edit event
                </p>
              </div>
            </a>

            <a
              href="/dashboard/penulis"
              className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors"
            >
              <Users className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium">Kelola Penulis</p>
                <p className="text-sm text-muted-foreground">
                  Tambah dan edit penulis
                </p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
