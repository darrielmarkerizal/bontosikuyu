"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "./article-card";
import { Article } from "./types";

interface ArticlesGridProps {
  articles: Article[];
  onLoadMore: () => void;
  hasMore: boolean;
}

export function ArticlesGrid({
  articles,
  onLoadMore,
  hasMore,
}: ArticlesGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        {
          y: 30,
          opacity: 0,
          scale: 0.8,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
          delay: 0.3,
        }
      );
    }
  }, []);

  const handleLoadMore = () => {
    // Animate button click
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
        onComplete: onLoadMore,
      });
    }
  };

  return (
    <>
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {articles.map((article, index) => (
          <ArticleCard key={article.id} article={article} index={index} />
        ))}
      </div>

      {hasMore && (
        <div className="text-center">
          <Button
            ref={buttonRef}
            variant="outline"
            size="lg"
            onClick={handleLoadMore}
            className="transition-all duration-300 hover:scale-105"
          >
            Muat Lebih Banyak
          </Button>
        </div>
      )}
    </>
  );
}
