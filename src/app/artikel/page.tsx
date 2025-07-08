"use client";

import { useState } from "react";
import {
  ArtikelHeader,
  FeaturedArticle,
  CategoryFilter,
  ArticlesGrid,
  Sidebar,
  type Article,
} from "@/components/artikel/public";

// Define the SidebarArticle type locally or import it with a different name
interface SidebarArticleType {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
}

// Mock data
const categories = [
  "Semua",
  "Kesehatan",
  "Gizi",
  "Stunting",
  "Perkembangan Anak",
];

const articles: Article[] = [
  {
    id: 1,
    title: "Tips Mencegah Stunting pada Anak Balita",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum.",
    author: "Dr. Sarah",
    date: "15 Jan 2024",
    readTime: "5 menit",
    category: "Stunting",
    image: "/api/placeholder/400/240",
  },
  {
    id: 2,
    title: "Pentingnya Gizi Seimbang untuk Tumbuh Kembang",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum.",
    author: "Dr. Ahmad",
    date: "12 Jan 2024",
    readTime: "4 menit",
    category: "Gizi",
    image: "/api/placeholder/400/240",
  },
  {
    id: 3,
    title: "Deteksi Dini Stunting dengan Teknologi AI",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum.",
    author: "Dr. Maya",
    date: "10 Jan 2024",
    readTime: "6 menit",
    category: "Teknologi",
    image: "/api/placeholder/400/240",
  },
  {
    id: 4,
    title: "Panduan Lengkap MPASI untuk Bayi 6 Bulan",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum.",
    author: "Dr. Lisa",
    date: "8 Jan 2024",
    readTime: "7 menit",
    category: "Gizi",
    image: "/api/placeholder/400/240",
  },
  {
    id: 5,
    title: "Mengenal Fase Perkembangan Anak Usia Dini",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum.",
    author: "Dr. Rudi",
    date: "5 Jan 2024",
    readTime: "5 menit",
    category: "Perkembangan Anak",
    image: "/api/placeholder/400/240",
  },
  {
    id: 6,
    title: "Cara Mengukur Tinggi dan Berat Badan Anak",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum.",
    author: "Dr. Nina",
    date: "3 Jan 2024",
    readTime: "4 menit",
    category: "Kesehatan",
    image: "/api/placeholder/400/240",
  },
];

const sidebarArticles: SidebarArticleType[] = [
  {
    id: 7,
    title: "Blog title heading will go here",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum.",
    author: "Full name",
    date: "11 Jan 2024",
    readTime: "5 minute read",
    category: "Category",
  },
  {
    id: 8,
    title: "Blog title heading will go here",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum.",
    author: "Full name",
    date: "11 Jan 2024",
    readTime: "5 minute read",
    category: "Category",
  },
  {
    id: 9,
    title: "Blog title heading will go here",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum.",
    author: "Full name",
    date: "11 Jan 2024",
    readTime: "5 minute read",
    category: "Category",
  },
];

export default function ArtikelPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [displayedArticles, setDisplayedArticles] = useState(
    articles.slice(1, 5)
  );

  const filteredArticles =
    activeCategory === "Semua"
      ? displayedArticles
      : displayedArticles.filter(
          (article) => article.category === activeCategory
        );

  const handleLoadMore = () => {
    // Simulate loading more articles
    setDisplayedArticles((prev) => [
      ...prev,
      ...articles.slice(prev.length + 1, prev.length + 3),
    ]);
  };

  const hasMore = displayedArticles.length < articles.length - 1;

  return (
    <div className="min-h-screen bg-slate-50">
      <ArtikelHeader
        title="Cerita Masyarakat Laiyolo Baru"
        description="Kumpulan kisah inspiratif, tradisi, dan perkembangan masyarakat Desa Laiyolo Baru dalam membangun komunitas yang lebih sehat dan sejahtera"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <FeaturedArticle article={articles[0]} />

            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            <ArticlesGrid
              articles={filteredArticles}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
            />
          </div>

          <Sidebar articles={sidebarArticles} />
        </div>
      </div>
    </div>
  );
}
