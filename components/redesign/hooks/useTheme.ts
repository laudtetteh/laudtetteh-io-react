import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

/**
 * Reads the theme state already applied to `<html>` by the blocking inline
 * script in `pages/_document.tsx` (which runs before hydration to avoid a
 * flash of the wrong theme), and returns it alongside a toggle function.
 *
 * Calling `toggleTheme` flips the `dark` class on `document.documentElement`
 * and persists the explicit choice to `localStorage` so it takes precedence
 * over the OS-level `prefers-color-scheme` on future visits.
 */
export function useTheme(): { theme: Theme; toggleTheme: () => void } {
  // Default to 'light' for the server-rendered / pre-hydration markup; the
  // effect below immediately syncs this to whatever the inline script set.
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      const nextTheme: Theme = prevTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.classList.toggle('dark', nextTheme === 'dark');
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
      return nextTheme;
    });
  }, []);

  return { theme, toggleTheme };
}
