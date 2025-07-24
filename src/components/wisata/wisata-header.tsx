"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MapPin, Camera } from "lucide-react";

export function WisataHeader() {
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (headerRef.current && titleRef.current && subtitleRef.current) {
      const tl = gsap.timeline();

      tl.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
      ).fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.5"
      );
    }
  }, []);

  return (
    <div
      ref={headerRef}
      className="relative bg-gradient-to-r from-brand-secondary to-gray-900 text-white py-16 lg:py-20"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.1%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat"></div>
      </div>

      <div className="relative container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-6">
            <Camera className="w-8 h-8" />
          </div>

          <h1
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-sentient font-bold mb-6"
          >
            Wisata Desa Laiyolo Baru
          </h1>

          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-gray-200 font-plus-jakarta-sans leading-relaxed max-w-3xl mx-auto mb-8"
          >
            Jelajahi keindahan alam dan kekayaan budaya empat dusun di Desa
            Laiyolo Baru. Temukan pengalaman wisata yang tak terlupakan di
            kepulauan Selayar.
          </p>

          <div className="flex items-center justify-center gap-2 text-white/80">
            <MapPin className="w-5 h-5" />
            <span className="font-plus-jakarta-sans">
              Kecamatan Bontosikuyu, Kabupaten Kepulauan Selayar, Sulawesi
              Selatan
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
