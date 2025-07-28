"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface LogsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
}

export function LogsPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  hasNextPage,
  hasPrevPage,
  onPageChange,
}: LogsPaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = (maxVisible: number = 5) => {
    const pages = [];

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= Math.min(maxVisible - 1, totalPages); i++) {
          pages.push(i);
        }
        if (totalPages > maxVisible - 1) {
          pages.push("...");
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 2) {
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

  return (
    <Card>
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col space-y-3 sm:space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          {/* Info */}
          <div className="text-xs sm:text-sm text-muted-foreground text-center lg:text-left order-2 lg:order-1">
            <span className="hidden xs:inline">Menampilkan </span>
            <span className="font-medium">
              {startItem}-{endItem}
            </span>
            <span className="hidden xs:inline"> dari </span>
            <span className="xs:hidden"> / </span>
            <span className="font-medium">{totalItems}</span>
            <span className="hidden xs:inline"> log</span>
          </div>

          {/* Pagination */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <Pagination>
              <PaginationContent className="gap-0 sm:gap-1">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => {
                      if (hasPrevPage) onPageChange(currentPage - 1);
                    }}
                    className={`${!hasPrevPage ? "pointer-events-none opacity-50" : ""} px-2 sm:px-3`}
                  />
                </PaginationItem>

                {/* Desktop and Tablet: Show page numbers */}
                <div className="hidden sm:contents">
                  {getPageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                      {page === "..." ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          onClick={() => onPageChange(page as number)}
                          isActive={page === currentPage}
                          className="min-w-[36px] h-9 px-3"
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                </div>

                {/* Mobile: Show current page info */}
                <div className="sm:hidden flex items-center px-3">
                  <span className="text-sm text-muted-foreground">
                    {currentPage} / {totalPages}
                  </span>
                </div>

                <PaginationItem>
                  <PaginationNext
                    onClick={() => {
                      if (hasNextPage) onPageChange(currentPage + 1);
                    }}
                    className={`${!hasNextPage ? "pointer-events-none opacity-50" : ""} px-2 sm:px-3`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
