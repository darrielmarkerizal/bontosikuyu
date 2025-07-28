"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface UmkmPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
}

export default function UmkmPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  hasNextPage,
  hasPrevPage,
  onPageChange,
}: UmkmPaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate visible page numbers based on screen size
  const getVisiblePages = () => {
    const maxVisible = 5; // Desktop default
    const mobileVisible = 3; // Mobile

    // For mobile, use fewer pages
    const visibleCount = window?.innerWidth < 640 ? mobileVisible : maxVisible;

    if (totalPages <= visibleCount) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const delta = Math.floor(visibleCount / 2);
    let start = Math.max(1, currentPage - delta);
    let end = Math.min(totalPages, currentPage + delta);

    // Adjust if we're near the beginning or end
    if (end - start + 1 < visibleCount) {
      if (start === 1) {
        end = Math.min(totalPages, start + visibleCount - 1);
      } else {
        start = Math.max(1, end - visibleCount + 1);
      }
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();
  const showStartEllipsis = visiblePages[0] > 2;
  const showEndEllipsis =
    visiblePages[visiblePages.length - 1] < totalPages - 1;

  // Mobile compact view
  const MobileView = () => (
    <div className="flex sm:hidden flex-col gap-4">
      {/* Mobile navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className="flex items-center gap-2 px-3 py-2 text-xs"
        >
          <ChevronLeft className="h-3 w-3" />
          Sebelumnya
        </Button>

        <span className="text-xs text-gray-600 font-medium">
          {currentPage} / {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="flex items-center gap-2 px-3 py-2 text-xs"
        >
          Selanjutnya
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
          style={{
            width: `${(currentPage / totalPages) * 100}%`,
          }}
        />
      </div>

      {/* Results info */}
      <div className="text-center text-xs text-gray-600">
        {startItem}-{endItem} dari {totalItems} UMKM
      </div>
    </div>
  );

  // Desktop/Tablet view using UI components
  const DesktopView = () => (
    <div className="hidden sm:flex flex-col gap-4">
      <Pagination className="justify-center">
        <PaginationContent className="gap-1 lg:gap-2">
          {/* Previous button */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => hasPrevPage && onPageChange(currentPage - 1)}
              className={`cursor-pointer ${
                !hasPrevPage
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : "hover:bg-yellow-50 hover:border-yellow-200"
              }`}
            />
          </PaginationItem>

          {/* First page */}
          {showStartEllipsis && (
            <>
              <PaginationItem>
                <PaginationLink
                  onClick={() => onPageChange(1)}
                  className="cursor-pointer hover:bg-yellow-50 hover:border-yellow-200"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            </>
          )}

          {/* Visible page numbers */}
          {visiblePages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => onPageChange(page)}
                isActive={page === currentPage}
                className={`cursor-pointer h-8 w-8 lg:h-9 lg:w-9 ${
                  page === currentPage
                    ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900 border-yellow-500"
                    : "hover:bg-yellow-50 hover:border-yellow-200"
                }`}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Last page */}
          {showEndEllipsis && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={() => onPageChange(totalPages)}
                  className="cursor-pointer hover:bg-yellow-50 hover:border-yellow-200"
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          {/* Next button */}
          <PaginationItem>
            <PaginationNext
              onClick={() => hasNextPage && onPageChange(currentPage + 1)}
              className={`cursor-pointer ${
                !hasNextPage
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : "hover:bg-yellow-50 hover:border-yellow-200"
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Results info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-600">
        <div>
          Menampilkan {startItem}-{endItem} dari {totalItems} UMKM
        </div>

        {/* Quick jump for desktop */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-sm text-gray-500">Lompat ke:</span>
          <select
            value={currentPage}
            onChange={(e) => onPageChange(parseInt(e.target.value))}
            className="px-2 py-1 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <option key={page} value={page}>
                Halaman {page}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Additional info for larger screens */}
      <div className="hidden md:flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <span>Total {totalPages} halaman</span>
          <span>•</span>
          <span>{itemsPerPage} item per halaman</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="disabled:opacity-50 disabled:cursor-not-allowed hover:text-yellow-600 transition-colors"
          >
            Halaman Pertama
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="disabled:opacity-50 disabled:cursor-not-allowed hover:text-yellow-600 transition-colors"
          >
            Halaman Terakhir
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      <MobileView />
      <DesktopView />
    </div>
  );
}
