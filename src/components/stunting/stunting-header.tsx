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
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="relative p-3 bg-white rounded-2xl shadow-lg border-2 border-brand-teal">
          <Brain className="h-8 w-8 sm:h-10 sm:w-10 text-brand-navy" />
          <div className="absolute -top-1 -right-1 bg-brand-yellow rounded-full p-1">
            <Zap className="h-3 w-3 text-brand-navy" />
          </div>
        </div>
      </div>

      <h1
        ref={titleRef}
        className="font-sentient text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-navy mb-4 leading-tight"
      >
        Deteksi Dini <span className="text-brand-teal italic">Stunting</span>{" "}
        dengan AI
      </h1>

      <p
        ref={descriptionRef}
        className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-6"
      >
        Teknologi canggih untuk deteksi dini risiko stunting pada anak dengan
        akurasi tinggi. Dapatkan analisis komprehensif dan rekomendasi yang
        tepat untuk kesehatan buah hati Anda.
      </p>

      <div
        ref={warningRef}
        className="inline-flex items-center gap-2 bg-brand-yellow/10 text-brand-navy px-4 py-2 rounded-xl border border-brand-yellow/30"
      >
        <AlertTriangle className="h-5 w-5 text-brand-yellow" />
        <span className="text-sm font-medium">
          Hasil prediksi AI ini bersifat informatif dan tidak menggantikan
          konsultasi medis
        </span>
      </div>
    </div>
  );
}
