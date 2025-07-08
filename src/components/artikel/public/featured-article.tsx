import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Article } from "./types";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface FeaturedArticleProps {
  article: Article;
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const image = imageRef.current;
    const content = contentRef.current;

    if (!card || !image || !content) return;

    // Initial animation
    gsap.fromTo(
      card,
      {
        y: 100,
        opacity: 0,
        scale: 0.95,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.3,
      }
    );

    // Hover animation
    const handleMouseEnter = () => {
      gsap.to(image, {
        scale: 1.05,
        duration: 0.6,
        ease: "power2.out",
      });
      gsap.to(card, {
        y: -8,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        duration: 0.4,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(image, {
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
      });
      gsap.to(card, {
        y: 0,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        duration: 0.4,
        ease: "power2.out",
      });
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <Card ref={cardRef} className="mb-8 overflow-hidden cursor-pointer">
      <div
        ref={imageRef}
        className="relative h-64 sm:h-80 lg:h-96 overflow-hidden"
      >
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
        />
      </div>
      <CardContent ref={contentRef} className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary">{article.category}</Badge>
          <span className="text-sm text-slate-500">
            {article.date} • {article.readTime}
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
          {article.title}
        </h2>
        <p className="text-slate-600 mb-4 leading-relaxed">{article.excerpt}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Oleh {article.author}</span>
          <Button variant="outline" size="sm">
            Baca Selengkapnya
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
