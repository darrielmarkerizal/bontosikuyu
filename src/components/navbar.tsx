"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
    label: "Monografis",
    path: "/monografis",
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

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Set isScrolled when scrolled more than 1px
      setIsScrolled(currentScrollY > 1);

      // Hide/show navbar based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold - hide navbar
        setIsVisible(false);
      } else {
        // Scrolling up or at top - show navbar
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    const handleResize = () => window.innerWidth >= 768 && setIsMenuOpen(false);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [lastScrollY]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const getNavItemClass = (currentPath: string) => {
    const baseClass = "relative px-4 py-2 transition-all duration-300 group";

    if (pathname === currentPath) {
      return `${baseClass} font-bold text-brand-secondary`;
    }

    return `${baseClass} font-medium text-slate-600 hover:text-brand-secondary`;
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full font-plus-jakarta-sans transition-all duration-500 bg-white shadow-lg border-b-2 border-brand-primary/20 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div
        className={`transition-all duration-300 ${
          isScrolled ? "px-6 py-3" : "px-4 py-4 md:px-8"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Enhanced Logo with Stylish Underline */}
          <Link
            href="/"
            className="relative group transition-all duration-300 hover:scale-105"
          >
            <div className="relative">
              <span className="font-sentient text-xl md:text-2xl">
                <span className="font-bold italic text-brand-secondary relative">
                  Laiyolo
                  {/* Decorative underline stroke */}
                  <svg
                    className="absolute -bottom-1 left-0 w-full h-2 text-brand-primary opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    viewBox="0 0 100 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 6c20-4 40-4 60 0s36 4 36 0"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <span className="font-normal text-brand-accent ml-1">Baru</span>
              </span>

              {/* Background glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={getNavItemClass(item.path)}
              >
                <span className="text-base font-plus-jakarta-sans">
                  {item.label}
                </span>
                {/* Underline animation for non-active items */}
                {pathname !== item.path && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-brand-primary transition-all duration-300 group-hover:left-4 group-hover:w-[calc(100%-2rem)]"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Enhanced Animated Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden relative p-3 rounded-xl text-brand-secondary hover:text-brand-primary hover:bg-brand-primary/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 group"
            aria-label="Toggle menu"
          >
            {/* Animated Hamburger Lines */}
            <div className="relative w-6 h-6 flex flex-col justify-center items-center">
              {/* Top Line */}
              <span
                className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                  isMenuOpen
                    ? "rotate-45 translate-y-0"
                    : "-translate-y-2 group-hover:w-7"
                }`}
              />

              {/* Middle Line */}
              <span
                className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                  isMenuOpen
                    ? "opacity-0 scale-0"
                    : "opacity-100 scale-100 group-hover:w-5"
                }`}
              />

              {/* Bottom Line */}
              <span
                className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                  isMenuOpen
                    ? "-rotate-45 translate-y-0"
                    : "translate-y-2 group-hover:w-7"
                }`}
              />
            </div>

            {/* Ripple Effect Background */}
            <div
              className={`absolute inset-0 rounded-xl bg-brand-primary/20 transform transition-all duration-300 ${
                isMenuOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
              }`}
            />
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? "max-h-64 mt-4" : "max-h-0"
          }`}
        >
          <div className="py-2 space-y-1 border-t-2 border-brand-primary/20">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-4 py-3 rounded-lg transition-colors duration-200 font-plus-jakarta-sans ${
                  pathname === item.path
                    ? "font-bold text-brand-secondary bg-brand-primary/10"
                    : "font-medium text-slate-600 hover:text-brand-secondary hover:bg-brand-primary/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
