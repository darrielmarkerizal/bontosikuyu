"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ArticleCard } from "./article-card";
import { Article } from "./types";

interface ArticlesGridProps {
  articles: Article[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ArticlesGrid({
  articles,
  currentPage,
  totalPages,
  onPageChange,
}: ArticlesGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    if (paginationRef.current) {
      gsap.fromTo(
        paginationRef.current,
        {
          y: 30,
          opacity: 0,
          scale: 0.8,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
          delay: 0.3,
        }
      );
    }
  }, []);

  const handlePageChange = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      // Animate page change
      if (paginationRef.current) {
        gsap.to(paginationRef.current, {
          scale: 0.95,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
          onComplete: () => onPageChange(page),
        });
      }
    }
  };

  // Get responsive max visible pages
  const getMaxVisiblePages = () => {
    if (!isMounted) return 3; // Default for SSR

    const width = window.innerWidth;
    if (width < 640) return 3; // Mobile (sm)
    if (width < 1024) return 4; // Tablet (lg)
    return 5; // Desktop
  };

  const getPageNumbers = () => {
    const maxVisible = getMaxVisiblePages();
    const pages = [];

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Smart pagination logic
      if (currentPage <= 3) {
        // Near beginning
        for (let i = 1; i <= Math.min(maxVisible - 1, totalPages); i++) {
          pages.push(i);
        }
        if (totalPages > maxVisible - 1) {
          pages.push("...");
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 2) {
        // Near end
        pages.push(1);
        pages.push("...");
        for (
          let i = Math.max(totalPages - maxVisible + 2, 1);
          i <= totalPages;
          i++
        ) {
          pages.push(i);
        }
      } else {
        // Middle
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const renderDesktopPagination = () => {
    const pages = getPageNumbers();

    return pages.map((page, index) => (
      <PaginationItem key={`page-${index}`}>
        {page === "..." ? (
          <PaginationEllipsis className="min-w-[36px] sm:min-w-[40px] h-8 sm:h-10 flex items-center justify-center" />
        ) : (
          <PaginationLink
            onClick={() => handlePageChange(page as number)}
            isActive={page === currentPage}
            className="cursor-pointer min-w-[36px] sm:min-w-[40px] h-8 sm:h-10 flex items-center justify-center text-sm"
          >
            {page}
          </PaginationLink>
        )}
      </PaginationItem>
    ));
  };

  return (
    <div className="w-full overflow-x-hidden">
      {/* Articles Grid - 3 columns on desktop for better space utilization */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        {articles.map((article, index) => (
          <ArticleCard key={article.id} article={article} index={index} />
        ))}
      </div>

      {totalPages > 1 && (
        <div ref={paginationRef} className="w-full">
          <div className="flex justify-center px-4">
            <Pagination className="w-full max-w-fit">
              <PaginationContent className="flex items-center justify-center gap-1 flex-wrap">
                {/* Previous Button */}
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={`cursor-pointer min-w-[36px] sm:min-w-[40px] h-8 sm:h-10 flex items-center justify-center px-2 sm:px-3 text-sm ${
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "hover:bg-gray-100"
                    }`}
                  />
                </PaginationItem>

                {/* Desktop & Tablet: Show page numbers */}
                <div className="hidden sm:contents">
                  {renderDesktopPagination()}
                </div>

                {/* Mobile: Show only current page info */}
                <div className="sm:hidden flex items-center justify-center min-w-[80px] px-3 py-1 text-sm text-muted-foreground bg-gray-50 rounded-md">
                  <span className="font-medium">
                    {currentPage} / {totalPages}
                  </span>
                </div>

                {/* Next Button */}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={`cursor-pointer min-w-[36px] sm:min-w-[40px] h-8 sm:h-10 flex items-center justify-center px-2 sm:px-3 text-sm ${
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "hover:bg-gray-100"
                    }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

          {/* Page Info - Hidden on mobile, shown on tablet+ */}
          <div className="hidden sm:flex justify-center mt-4">
            <div className="text-sm text-muted-foreground">
              Halaman {currentPage} dari {totalPages}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
