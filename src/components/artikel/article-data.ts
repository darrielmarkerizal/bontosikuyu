import { Article } from "./article-types";

export const mockArticles: Article[] = [
  {
    id: 1,
    title: "Peningkatan Infrastruktur Jalan di Bontosikuyu",
    excerpt:
      "Program pembangunan jalan raya untuk meningkatkan akses transportasi masyarakat di wilayah Kecamatan Bontosikuyu.",
    author: "Budi Santoso",
    category: "Infrastruktur",
    publishDate: "2024-01-15",
    status: "published",
    views: 125,
    image: "/api/placeholder/300/200",
  },
  {
    id: 2,
    title: "Festival Budaya Selayar 2024",
    excerpt:
      "Perayaan budaya tahunan yang menampilkan kearifan lokal dan tradisi masyarakat Selayar.",
    author: "Siti Aminah",
    category: "Budaya",
    publishDate: "2024-01-14",
    status: "published",
    views: 89,
    image: "/api/placeholder/300/200",
  },
  {
    id: 3,
    title: "Program Bantuan UMKM Kecamatan",
    excerpt:
      "Inisiatif pemerintah kecamatan untuk mendukung usaha mikro, kecil, dan menengah di wilayah Bontosikuyu.",
    author: "Ahmad Hidayat",
    category: "Ekonomi",
    publishDate: "2024-01-13",
    status: "draft",
    views: 167,
    image: "/api/placeholder/300/200",
  },
  {
    id: 4,
    title: "Sosialisasi Program Kesehatan Ibu dan Anak",
    excerpt:
      "Kegiatan edukasi kesehatan untuk meningkatkan kesadaran masyarakat tentang pentingnya kesehatan ibu dan anak.",
    author: "Dr. Fatimah",
    category: "Kesehatan",
    publishDate: "2024-01-12",
    status: "published",
    views: 203,
    image: "/api/placeholder/300/200",
  },
  {
    id: 5,
    title: "Gotong Royong Pembersihan Pantai Bira",
    excerpt:
      "Aksi bersama masyarakat untuk menjaga kebersihan dan kelestarian pantai sebagai destinasi wisata.",
    author: "Pak Hasan",
    category: "Lingkungan",
    publishDate: "2024-01-11",
    status: "published",
    views: 156,
    image: "/api/placeholder/300/200",
  },
];
