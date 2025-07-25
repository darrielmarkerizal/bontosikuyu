"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Article } from "./types";

interface ArticleCardProps {
  article: Article;
  index?: number;
  onImageError?: () => void;
  onImageLoad?: () => void;
}

export function ArticleCard({
  article,
  index = 0,
  onImageError,
  onImageLoad,
}: ArticleCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const image = imageRef.current;

    if (!card || !image) return;

    // Initial animation on mount
    gsap.fromTo(
      card,
      {
        y: 60,
        opacity: 0,
        rotateX: 15,
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: index * 0.1,
      }
    );

    // Hover animations
    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -12,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        duration: 0.4,
        ease: "power2.out",
      });

      gsap.to(image, {
        scale: 1.08,
        duration: 0.6,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        duration: 0.4,
        ease: "power2.out",
      });

      gsap.to(image, {
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
      });
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [index]);

  return (
    <Link href={`/artikel/${article.id}`} className="block">
      <Card
        ref={cardRef}
        className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow duration-300"
      >
        <div ref={imageRef} className="relative h-48 overflow-hidden">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            onError={onImageError}
            onLoad={onImageLoad}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={index < 3}
          />
        </div>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="text-xs">
              {article.category}
            </Badge>
          </div>
          <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-brand-navy transition-colors duration-300">
            {article.title}
          </h3>
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{article.author}</span>
            <span>
              {article.date} • {article.readTime}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
