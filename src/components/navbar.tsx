"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

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
    path: "/dashboard/artikel",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 1);
    const handleResize = () => window.innerWidth >= 768 && setIsMenuOpen(false);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const getNavItemClass = (currentPath: string) => {
    const baseClass = "relative px-4 py-2 transition-all duration-300 group";

    if (pathname === currentPath) {
      return `${baseClass} font-bold text-slate-900`;
    }

    return `${baseClass} font-medium text-slate-600 hover:text-slate-900`;
  };

  return (
    <nav
      className={`fixed top-0 z-50 w-full font-sans transition-all duration-500 ${
        isMenuOpen ? "bg-white shadow-lg" : ""
      } ${
        isScrolled
          ? "transform translate-y-2 scale-x-95 mx-4 rounded-xl bg-white/95 backdrop-blur-md shadow-lg border border-white/20"
          : "bg-white/80 backdrop-blur-md border-b border-white/20"
      }`}
    >
      <div
        className={`transition-all duration-500 ${
          isScrolled ? "px-6 py-3" : "px-4 py-4 md:px-8"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="transition-all duration-300">
            <span
              className={`font-sentient transition-all duration-300 ${
                isScrolled ? "text-lg md:text-xl" : "text-xl md:text-2xl"
              }`}
            >
              <span className="font-bold italic text-slate-900">Laiyolo</span>
              <span className="font-normal text-slate-600">Baru</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={getNavItemClass(item.path)}
              >
                <span
                  className={`transition-all duration-300 ${
                    isScrolled ? "text-sm" : "text-base"
                  }`}
                >
                  {item.label}
                </span>
                {/* Underline animation for non-active items */}
                {pathname !== item.path && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-slate-900 transition-all duration-300 group-hover:left-4 group-hover:w-[calc(100%-2rem)]"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? "max-h-64 mt-4" : "max-h-0"
          }`}
        >
          <div className="py-2 space-y-1 border-t border-slate-100">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-4 py-3 rounded-lg transition-colors duration-200 ${
                  pathname === item.path
                    ? "font-bold text-slate-900 bg-slate-50"
                    : "font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
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
