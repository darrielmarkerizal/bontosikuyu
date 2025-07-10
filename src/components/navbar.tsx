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
    path: "/artikel",
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
      return `${baseClass} font-bold text-brand-navy`;
    }

    return `${baseClass} font-medium text-slate-600 hover:text-brand-navy`;
  };

  return (
    <nav
      className={`fixed top-0 z-50 w-full font-sans transition-all duration-500 ${
        isMenuOpen ? "bg-white shadow-lg border-brand-teal border-2" : ""
      } ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b-2 border-brand-teal/20"
          : "bg-white/80 backdrop-blur-md border-b-2 border-brand-teal/20"
      } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div
        className={`transition-all duration-500 ${
          isScrolled ? "px-6 py-3" : "px-4 py-4 md:px-8"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="transition-all duration-300">
            <span className="font-sentient text-xl md:text-2xl">
              <span className="font-bold italic text-brand-navy">Laiyolo</span>
              <span className="font-normal text-brand-teal">Baru</span>
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
                <span className="text-base">{item.label}</span>
                {/* Underline animation for non-active items */}
                {pathname !== item.path && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-brand-teal transition-all duration-300 group-hover:left-4 group-hover:w-[calc(100%-2rem)]"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-brand-navy hover:text-brand-teal hover:bg-brand-teal/10 transition-colors duration-200"
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
          <div className="py-2 space-y-1 border-t-2 border-brand-teal/20">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-4 py-3 rounded-lg transition-colors duration-200 ${
                  pathname === item.path
                    ? "font-bold text-brand-navy bg-brand-teal/10"
                    : "font-medium text-slate-600 hover:text-brand-navy hover:bg-brand-teal/10"
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
