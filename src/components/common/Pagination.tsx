import { useState, useId, useRef, useEffect } from "react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: "square" | "circle" | "text" | "minimal";
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [];

  if (current <= 3) {
    pages.push(1, 2, 3, "...", total);
  } else if (current >= total - 2) {
    pages.push(1, "...", total - 2, total - 1, total);
  } else {
    pages.push(1, "...", current - 1, current, current + 1, "...", total);
  }

  return pages;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  variant = "square",
}: PaginationProps) {
  if (variant === "minimal") {
    return (
      <MinimalPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    );
  }

  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;
  const pages = getPageNumbers(currentPage, totalPages);

  const shapeClass = variant === "circle" ? "rounded-full" : "rounded-control";

  const baseBtn = `flex items-center justify-center w-10 h-10 ${shapeClass} text-[14px] leading-[21px] font-bold tracking-[-1px] transition-colors duration-100 select-none`;

  const activeBtn = `${baseBtn} bg-text-primary text-white`;
  const inactiveBtn = `${baseBtn} bg-disabled text-high-emphasis hover:bg-stroke cursor-pointer`;
  const disabledBtn = `${baseBtn} bg-disabled text-low-emphasis cursor-not-allowed`;

  return (
    <nav aria-label="Pagination" className="flex items-center gap-2 font-pretendard">
      {variant === "text" ? (
        <button
          type="button"
          disabled={isFirst}
          onClick={() => onPageChange(currentPage - 1)}
          className={`text-[14px] leading-[21px] font-normal tracking-[-1px] px-2 ${
            isFirst
              ? "text-low-emphasis cursor-not-allowed"
              : "text-low-emphasis hover:text-high-emphasis cursor-pointer"
          }`}
        >
          Prev
        </button>
      ) : (
        <>
          <button
            type="button"
            aria-label="첫 페이지"
            disabled={isFirst}
            onClick={() => onPageChange(1)}
            className={isFirst ? disabledBtn : inactiveBtn}
          >
            <ChevronsLeft />
          </button>
          <button
            type="button"
            aria-label="이전 페이지"
            disabled={isFirst}
            onClick={() => onPageChange(currentPage - 1)}
            className={isFirst ? disabledBtn : inactiveBtn}
          >
            <ChevronLeft />
          </button>
        </>
      )}

      {pages.map((page, idx) =>
        page === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className="flex w-10 h-10 items-center justify-center text-[14px] text-low-emphasis select-none"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            aria-label={`페이지 ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            onClick={() => onPageChange(page)}
            className={page === currentPage ? activeBtn : inactiveBtn}
          >
            {page}
          </button>
        ),
      )}

      {variant === "text" ? (
        <button
          type="button"
          disabled={isLast}
          onClick={() => onPageChange(currentPage + 1)}
          className={`text-[14px] leading-[21px] font-normal tracking-[-1px] px-2 ${
            isLast
              ? "text-low-emphasis cursor-not-allowed"
              : "text-high-emphasis hover:text-default cursor-pointer"
          }`}
        >
          Next
        </button>
      ) : (
        <>
          <button
            type="button"
            aria-label="다음 페이지"
            disabled={isLast}
            onClick={() => onPageChange(currentPage + 1)}
            className={isLast ? disabledBtn : inactiveBtn}
          >
            <ChevronRight />
          </button>
          <button
            type="button"
            aria-label="마지막 페이지"
            disabled={isLast}
            onClick={() => onPageChange(totalPages)}
            className={isLast ? disabledBtn : inactiveBtn}
          >
            <ChevronsRight />
          </button>
        </>
      )}
    </nav>
  );
}

function MinimalPagination({
  currentPage,
  totalPages,
  onPageChange,
}: Omit<PaginationProps, "variant">) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className="flex items-center gap-2 font-pretendard">
      <span className="text-[16px] leading-[24px] font-normal tracking-[-1px] text-high-emphasis">
        Page
      </span>
      <div ref={containerRef} className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={`${id}-page-list`}
          onClick={() => setIsOpen((prev) => !prev)}
          className={`flex items-center gap-2 rounded-control border border-stroke bg-white px-3 py-2 text-[16px] leading-[24px] font-normal tracking-[-1px] text-high-emphasis outline-none transition-all duration-150 cursor-pointer ${
            isOpen ? "ring-2 ring-primary" : "hover:border-default"
          }`}
        >
          {currentPage}
          <svg
            className={`h-4 w-4 text-caption transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {isOpen && (
          <ul
            id={`${id}-page-list`}
            role="listbox"
            className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-control bg-white py-1 shadow-card"
          >
            {pages.map((page) => (
              <li
                key={page}
                role="option"
                aria-selected={page === currentPage}
                onClick={() => {
                  onPageChange(page);
                  setIsOpen(false);
                }}
                className={`cursor-pointer px-3 py-2 text-center text-[14px] leading-[21px] font-normal tracking-[-1px] transition-colors duration-100 ${
                  page === currentPage
                    ? "text-primary hover:bg-input"
                    : "text-high-emphasis hover:bg-input"
                }`}
              >
                {page}
              </li>
            ))}
          </ul>
        )}
      </div>
      <span className="text-[16px] leading-[24px] font-normal tracking-[-1px] text-high-emphasis">
        of {totalPages}
      </span>
    </nav>
  );
}

/* ── Icon Components ── */

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ChevronsLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10.78 5.22a.75.75 0 0 1 0 1.06L7.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
        clipRule="evenodd"
      />
      <path
        fillRule="evenodd"
        d="M14.78 5.22a.75.75 0 0 1 0 1.06L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ChevronsRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M5.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
      <path
        fillRule="evenodd"
        d="M9.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L12.94 10 9.22 6.28a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default Pagination;
