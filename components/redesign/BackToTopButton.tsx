import React, { useEffect, useState } from 'react';

const SHOW_AFTER = 480;

/** A floating return control that stays out of the way near the top of long pages. */
export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setIsVisible(window.scrollY > SHOW_AFTER);

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      title="Back to top"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-6 right-6 z-40 rounded-full border border-teal-700 bg-slate-50 p-3 text-teal-700 shadow-lg transition-all duration-200 hover:bg-teal-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 dark:border-teal-400 dark:bg-slate-900 dark:text-teal-400 dark:hover:bg-teal-400 dark:hover:text-slate-900 dark:focus-visible:ring-teal-400 md:bottom-8 md:right-8 ${
        isVisible ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
      }`}
    >
      <ArrowUpIcon />
    </button>
  );
}

const ArrowUpIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m-5.5 5.5L12 5l5.5 5.5" />
  </svg>
);
