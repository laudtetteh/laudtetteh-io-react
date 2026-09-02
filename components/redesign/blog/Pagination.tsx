import classNames from 'classnames';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Prev/Next + page-number controls for `/blog`, restyled with the redesign
 * outline/fill button convention (see `AboutSection.tsx`'s outlined button).
 * Keeps the existing client-side `currentPage` state mechanism from
 * `pages/blog/index.tsx` — switching to URL-driven pagination isn't
 * requested by #60.
 */
export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-teal-600 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600 dark:border-slate-800 dark:text-slate-400 dark:hover:border-teal-400 dark:hover:text-teal-400"
      >
        Previous
      </button>

      <div className="flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => {
          const isActive = pageNumber === currentPage;
          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              aria-current={isActive ? 'page' : undefined}
              className={classNames(
                'h-9 w-9 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-teal-700 text-white dark:bg-teal-400 dark:text-slate-900'
                  : 'text-slate-600 hover:bg-teal-600/10 hover:text-teal-700 dark:text-slate-400 dark:hover:bg-teal-400/10 dark:hover:text-teal-400'
              )}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-teal-600 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600 dark:border-slate-800 dark:text-slate-400 dark:hover:border-teal-400 dark:hover:text-teal-400"
      >
        Next
      </button>
    </nav>
  );
}
