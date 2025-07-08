"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface ArtikelHeaderProps {
  title: string;
  description: string;
}

export function ArtikelHeader({ title, description }: ArtikelHeaderProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      titleRef.current,
      {
        y: 60,
        opacity: 0,
        scale: 0.9,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power3.out",
      }
    ).fromTo(
      descriptionRef.current,
      {
        y: 40,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.6"
    );
  }, []);

  return (
    <div className="bg-white border-b overflow-hidden">
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl">
          <h1
            ref={titleRef}
            className="font-sentient text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4"
          >
            {title}
          </h1>
          <p
            ref={descriptionRef}
            className="text-lg text-slate-600 leading-relaxed"
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
