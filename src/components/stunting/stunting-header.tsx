"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Brain, Zap, AlertTriangle } from "lucide-react";

export function StuntingHeader() {
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const warningRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      headerRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    )
      .fromTo(
        titleRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.4"
      )
      .fromTo(
        descriptionRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        warningRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
        "-=0.2"
      );
  }, []);

  return (
    <div ref={headerRef} className="text-center mb-8 sm:mb-12">
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="relative p-4 bg-white rounded-2xl shadow-xl border-2 border-brand-accent/30">
          <Brain className="h-8 w-8 sm:h-10 sm:w-10 text-brand-secondary" />
          <div className="absolute -top-2 -right-2 bg-brand-primary rounded-full p-2 shadow-lg">
            <Zap className="h-4 w-4 text-brand-secondary" />
          </div>
        </div>
      </div>

      <h1
        ref={titleRef}
        className="font-sentient text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-secondary mb-6 leading-tight"
      >
        Deteksi Dini <span className="text-brand-accent italic">Stunting</span>{" "}
        dengan AI
      </h1>

      <p
        ref={descriptionRef}
        className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8 font-plus-jakarta-sans"
      >
        Teknologi canggih untuk deteksi dini risiko stunting pada anak dengan
        akurasi tinggi. Dapatkan analisis komprehensif dan rekomendasi yang
        tepat untuk kesehatan buah hati Anda.
      </p>

      <div
        ref={warningRef}
        className="inline-flex items-center gap-3 bg-brand-primary/10 text-brand-secondary px-6 py-4 rounded-2xl border-2 border-brand-primary/30 shadow-lg backdrop-blur-sm"
      >
        <AlertTriangle className="h-5 w-5 text-brand-primary flex-shrink-0" />
        <span className="text-sm font-medium font-plus-jakarta-sans">
          Hasil prediksi AI ini bersifat informatif dan tidak menggantikan
          konsultasi medis
        </span>
      </div>
    </div>
  );
}
