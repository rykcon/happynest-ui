// src/components/ui/pagination/AppPagination.tsx
"use client";

import { useRouter } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../pagination";

export function AppPagination({
  currentPage,
  totalPages,
  hrefTemplate,
  onPageChange,
  showIcons = true,
  className = "",
}: {
  currentPage: number;
  totalPages: number;
  hrefTemplate?: string;
  onPageChange?: (page: number) => void;
  showIcons?: boolean;
  className?: string;
}) {
  const router = useRouter();

  const goTo = (page: number) => {
    if (page < 1 || page > totalPages) return;
    if (onPageChange) {
      onPageChange(page);
      return;
    }
    if (!hrefTemplate) return;
    const href = hrefTemplate.replace("__PAGE__", String(page));
    router.push(href);
  };

  const maxVisible = 5;
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${className}`}>
      <div className="text-sm text-muted-foreground whitespace-nowrap">
        Page {currentPage} of {totalPages}
      </div>
      <Pagination className="justify-end">
        <PaginationContent>
          <PaginationItem>
            {currentPage <= 1 ? (
              <PaginationPrevious
                aria-disabled
                className="pointer-events-none opacity-50"
                href="#"
              />
            ) : hrefTemplate && !onPageChange ? (
              <PaginationPrevious href={hrefTemplate.replace("__PAGE__", String(currentPage - 1))} />
            ) : (
              <PaginationPrevious
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  goTo(currentPage - 1);
                }}
              />
            )}
          </PaginationItem>
          {pages.map((page) => {
            const active = page === currentPage;
            return (
              <PaginationItem key={page}>
                {hrefTemplate && !onPageChange ? (
                  <PaginationLink
                    href={hrefTemplate.replace("__PAGE__", String(page))}
                    isActive={active}
                  >
                    {page}
                  </PaginationLink>
                ) : (
                  <PaginationLink
                    href="#"
                    isActive={active}
                    onClick={(event) => {
                      event.preventDefault();
                      goTo(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            );
          })}
          <PaginationItem>
            {currentPage >= totalPages ? (
              <PaginationNext
                aria-disabled
                className="pointer-events-none opacity-50"
                href="#"
              />
            ) : hrefTemplate && !onPageChange ? (
              <PaginationNext href={hrefTemplate.replace("__PAGE__", String(currentPage + 1))} />
            ) : (
              <PaginationNext
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  goTo(currentPage + 1);
                }}
              />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
