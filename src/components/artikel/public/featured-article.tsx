"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Article } from "./types";

interface FeaturedArticleProps {
  article: Article;
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  const articleRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      imageRef.current,
      {
        x: -100,
        opacity: 0,
        scale: 0.8,
      },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power3.out",
      }
    ).fromTo(
      contentRef.current,
      {
        x: 100,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.6"
    );
  }, []);

  return (
    <div ref={articleRef} className="mb-12">
      <div className="bg-white rounded-2xl shadow-lg border-2 border-brand-yellow/20 overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Image */}
          <div ref={imageRef} className="relative h-64 lg:h-auto">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge className="bg-brand-yellow text-brand-navy font-medium">
                Featured
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div
            ref={contentRef}
            className="p-6 lg:p-8 flex flex-col justify-center"
          >
            <div className="mb-4">
              <Badge
                variant="outline"
                className="border-brand-teal text-brand-teal mb-3"
              >
                {article.category}
              </Badge>
              <h2 className="text-2xl lg:text-3xl font-bold text-brand-navy mb-4 leading-tight">
                {article.title}
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                {article.excerpt}
              </p>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{article.readTime}</span>
              </div>
            </div>

            <Link href={`/artikel/${article.id}`}>
              <Button className="bg-brand-navy hover:bg-brand-navy/90 text-white group">
                Baca Selengkapnya
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
