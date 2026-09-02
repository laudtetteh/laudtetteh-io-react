import React from "react";
import classNames from "classnames";

import { useTheme } from "./hooks/useTheme";

/**
 * Sun/moon icon button that toggles between light and dark mode.
 *
 * A real `<button>`, so it is keyboard-operable with zero extra work. The
 * `aria-label` describes the action the button performs (the mode it will
 * switch *to*), not the current state, per standard toggle-button a11y
 * guidance. The icon cross-fade respects `prefers-reduced-motion` — motion
 * is disabled entirely for users who request it, leaving an instant swap.
 */
export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-500 text-slate-900 transition-colors hover:bg-slate-100 dark:border-slate-500 dark:text-slate-100 dark:hover:bg-slate-800 motion-reduce:transition-none"
    >
      {/* Icon shown is the mode a click switches TO, matching the aria-label above. */}
      <span
        aria-hidden="true"
        className={classNames(
          "absolute inset-0 flex items-center justify-center transition-opacity duration-200 motion-reduce:transition-none",
          isDark ? "opacity-100" : "opacity-0"
        )}
      >
        <SunIcon />
      </span>
      <span
        aria-hidden="true"
        className={classNames(
          "absolute inset-0 flex items-center justify-center transition-opacity duration-200 motion-reduce:transition-none",
          isDark ? "opacity-0" : "opacity-100"
        )}
      >
        <MoonIcon />
      </span>
    </button>
  );
};

const SunIcon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <circle cx={12} cy={12} r={4} />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M17.66 17.66l1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M4.93 19.07l1.41-1.41" />
      <path d="M17.66 6.34l1.41-1.41" />
    </svg>
  );
};

const MoonIcon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
};
