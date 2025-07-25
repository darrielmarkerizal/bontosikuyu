"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { SidebarArticleType } from "./types";

interface SidebarArticleProps {
  article: SidebarArticleType;
  index?: number;
}

export function SidebarArticle({ article, index = 0 }: SidebarArticleProps) {
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = articleRef.current;
    if (!element) return;

    gsap.fromTo(
      element,
      {
        x: 20,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        delay: index * 0.1,
      }
    );

    // Hover animation
    const handleMouseEnter = () => {
      gsap.to(element, {
        x: 8,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [index]);

  return (
    <Link href={`/artikel/${article.id}`} className="block">
      <div
        ref={articleRef}
        className="flex gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="w-16 h-16 bg-slate-200 rounded-lg flex-shrink-0 flex items-center justify-center transition-all duration-300 group-hover:bg-slate-300">
          <div className="w-6 h-6 bg-slate-400 rounded transition-all duration-300 group-hover:bg-slate-500"></div>
        </div>
        <div className="flex-1">
          <Badge variant="secondary" className="text-xs mb-1">
            {article.category}
          </Badge>
          <h4 className="font-semibold text-sm text-slate-900 mb-1 line-clamp-2 group-hover:text-brand-navy transition-colors duration-300">
            {article.title}
          </h4>
          <p className="text-xs text-slate-600 line-clamp-2 mb-2">
            {article.excerpt}
          </p>
          <div className="text-xs text-slate-500">
            {article.author} • {article.readTime}
          </div>
        </div>
      </div>
    </Link>
  );
}
