"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarArticle } from "./sidebar-article";
import { SidebarArticleType } from "./types";

interface SidebarProps {
  articles: SidebarArticleType[];
}

export function Sidebar({ articles }: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const recentArticlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const recent = recentArticlesRef.current;

    if (!recent) return;

    // Immediate animation on mount
    gsap.fromTo(
      recent,
      {
        x: 60,
        opacity: 0,
        rotateY: 15,
      },
      {
        x: 0,
        opacity: 1,
        rotateY: 0,
        duration: 0.8,
        ease: "power2.out",
      }
    );
  }, []);

  return (
    <div ref={sidebarRef} className="lg:w-1/3">
      <div className="sticky top-24 space-y-6">
        {/* Recent Articles */}
        <Card ref={recentArticlesRef}>
          <CardHeader>
            <CardTitle className="text-lg">Artikel Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {articles.map((article, index) => (
              <div key={article.id}>
                <SidebarArticle article={article} index={index} />
                {index < articles.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
