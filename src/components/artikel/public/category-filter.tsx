"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (filterRef.current) {
      gsap.fromTo(
        filterRef.current?.children,
        {
          x: -30,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1,
        }
      );
    }
  }, []);

  return (
    <div className="mb-8">
      <div
        ref={filterRef}
        className="flex flex-wrap gap-2 sm:gap-3 justify-center"
        role="tablist"
        aria-label="Filter artikel berdasarkan kategori"
      >
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category)}
            role="tab"
            aria-selected={activeCategory === category}
            aria-controls="articles-list"
            className={`transition-all duration-300 hover:scale-105 font-medium px-4 py-2 min-h-[40px] ${
              activeCategory === category
                ? "bg-brand-navy text-white hover:bg-brand-navy/90 shadow-md border-brand-navy"
                : "border-2 border-brand-teal text-brand-navy bg-white hover:bg-brand-teal hover:text-white hover:border-brand-teal shadow-sm"
            }`}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
}
