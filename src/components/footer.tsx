"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  {
    label: "Beranda",
    path: "/",
  },
  {
    label: "AI Deteksi Stunting",
    path: "/stunting",
  },
  {
    label: "Artikel",
    path: "/artikel",
  },
  {
    label: "Infografis",
    path: "/infografis",
  },
  {
    label: "Wisata",
    path: "/wisata",
  },
  {
    label: "UMKM",
    path: "/umkm",
  },
];

export default function Footer() {
  const pathname = usePathname();
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Get current year dynamically
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const footer = footerRef.current;
    const content = contentRef.current;

    if (!footer || !content) return;

    // Set initial states
    gsap.set(content, {
      opacity: 0,
      y: 30,
    });

    // Animate footer elements when they come into view
    ScrollTrigger.create({
      trigger: footer,
      start: "top 85%",
      onEnter: () => {
        gsap.to(content, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  const getLinkClass = (currentPath: string) => {
    const baseClass =
      "relative px-3 py-2 transition-all duration-300 group rounded-lg block text-left";

    if (pathname === currentPath) {
      return `${baseClass} font-semibold text-brand-primary bg-brand-primary/15`;
    }

    return `${baseClass} font-medium text-gray-300 hover:text-brand-primary hover:bg-brand-primary/10`;
  };

  return (
    <footer
      ref={footerRef}
      className="relative bg-gradient-to-br from-brand-secondary via-gray-900 to-black text-white overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-brand-primary rounded-full blur-3xl"></div>
        <div
          className="absolute bottom-20 right-20 w-24 h-24 bg-brand-accent rounded-full blur-2xl"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div ref={contentRef} className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Side - Website Information */}
            <div className="space-y-8">
              {/* Logo and Description */}
              <div className="space-y-6">
                <Link
                  href="/"
                  className="inline-block group transition-all duration-300 hover:scale-105"
                >
                  <span className="font-sentient text-3xl md:text-4xl">
                    <span className="font-bold text-white">Laiyolo</span>
                    <span className="font-normal text-brand-accent ml-2">
                      Baru
                    </span>
                  </span>
                </Link>

                <p className="text-gray-300 font-plus-jakarta-sans leading-relaxed text-lg max-w-md">
                  Website resmi Desa Laiyolo Baru, Kecamatan Bontosikuyu,
                  Kabupaten Kepulauan Selayar. Membangun masa depan yang lebih
                  baik melalui teknologi dan inovasi.
                </p>
              </div>

              {/* Village Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-sentient font-semibold text-white">
                  Informasi Desa
                </h4>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-center space-x-3">
                    <span className="text-brand-accent text-lg">📍</span>
                    <span className="font-plus-jakarta-sans">
                      Kepulauan Selayar, Sulawesi Selatan
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-brand-accent text-lg">🏛️</span>
                    <span className="font-plus-jakarta-sans">
                      Kecamatan Bontosikuyu
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-brand-accent text-lg">📮</span>
                    <span className="font-plus-jakarta-sans">
                      Kode Pos 92855
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Navigation Menu */}
            <div className="space-y-8">
              <h3 className="text-2xl font-sentient font-semibold text-white">
                Jelajahi Website
              </h3>

              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={getLinkClass(item.path)}
                  >
                    <span className="font-plus-jakarta-sans relative z-10">
                      {item.label}
                    </span>

                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/20 to-brand-accent/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

                    {/* Active indicator */}
                    {pathname === item.path && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-brand-primary rounded-r-full"></div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 bg-black/30">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-gray-400 font-plus-jakarta-sans text-center md:text-left">
                © {currentYear} Desa Laiyolo Baru. Semua hak cipta dilindungi.
              </p>

              {/* Small Collaboration Logo */}
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-500 font-plus-jakarta-sans">
                  Bekerja sama dengan
                </span>
                <div className="relative w-8 h-8 group">
                  <Image
                    src="/logo_siruntu.png"
                    alt="Tim KKN PPM UGM Siruntu Selayar"
                    fill
                    className="object-contain filter brightness-75 group-hover:brightness-100 transition-all duration-300"
                    sizes="32px"
                  />
                </div>
                <span className="text-xs text-gray-500 font-plus-jakarta-sans">
                  Tim KKN PPM UGM PERIODE II TAHUN 2025 SIRUNTU SELAYAR
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative wave at top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden">
        <svg
          className="relative block w-full h-12"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className="fill-white/10"
          />
        </svg>
      </div>
    </footer>
  );
}
