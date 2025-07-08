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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const buttons = containerRef.current?.children;
    if (!buttons) return;

    gsap.fromTo(
      Array.from(buttons),
      {
        y: 20,
        opacity: 0,
        scale: 0.8,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
        stagger: 0.1,
      }
    );
  }, []);

  const handleCategoryClick = (category: string) => {
    onCategoryChange(category);

    // Animate button press
    const button = event?.target as HTMLElement;
    if (button) {
      gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });
    }
  };

  return (
    <div className="mb-6">
      <div ref={containerRef} className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={category === activeCategory ? "default" : "outline"}
            size="sm"
            className="text-sm transition-all duration-300 hover:scale-105"
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
}
