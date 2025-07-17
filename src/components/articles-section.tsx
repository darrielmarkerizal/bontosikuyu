"use client";

import { Button } from "@/components/ui/button";

import { BoxReveal } from "./magicui/box-reveal";
import { ArticleCard } from "@/components/artikel/public/article-card";
import { Article } from "@/components/artikel/public/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Mock data for latest articles - same structure as artikel page
const latestArticles: Article[] = [
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
];

export default function ArticlesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <BoxReveal
            boxColor="#F8B72C"
            duration={0.5}
            width="fit-content"
            textAlign="center"
          >
            <div className="inline-flex items-center px-6 py-3 bg-brand-primary/10 rounded-full border border-brand-primary/20 mb-6">
              <span className="text-sm font-medium text-brand-primary font-plus-jakarta-sans tracking-wide uppercase">
                Artikel Terbaru
              </span>
            </div>
          </BoxReveal>

          <BoxReveal
            boxColor="#F8B72C"
            duration={0.5}
            width="100%"
            textAlign="center"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-sentient font-bold text-brand-secondary mb-6">
              Cerita & Informasi
            </h2>
          </BoxReveal>

          <BoxReveal
            boxColor="#F8B72C"
            duration={0.5}
            width="100%"
            textAlign="center"
          >
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto font-plus-jakarta-sans leading-relaxed">
              Temukan artikel terbaru seputar kesehatan, gizi, dan perkembangan
              anak untuk mendukung tumbuh kembang optimal di Desa Laiyolo Baru
            </p>
          </BoxReveal>
        </div>

        {/* Articles Grid */}
        <div className="mb-12">
          <BoxReveal
            boxColor="#21BCA8"
            duration={0.6}
            width="100%"
            textAlign="center"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestArticles.map((article, index) => (
                <ArticleCard key={article.id} article={article} index={index} />
              ))}
            </div>
          </BoxReveal>
        </div>

        {/* Call to Action */}
        <BoxReveal
          boxColor="#F8B72C"
          duration={0.5}
          width="fit-content"
          textAlign="center"
        >
          <div className="text-center">
            <Link href="/artikel">
              <Button
                size="lg"
                className="bg-brand-primary text-brand-secondary hover:bg-brand-primary/90 hover:text-brand-secondary px-8 py-4 text-lg font-plus-jakarta-sans font-semibold shadow-xl transition-all duration-300 group"
              >
                Lihat Semua Artikel
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </BoxReveal>
      </div>
    </section>
  );
}
