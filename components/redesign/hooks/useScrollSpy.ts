import { useEffect, useState } from 'react';

/**
 * Tracks which of the given section IDs is currently most visible in the
 * viewport and returns it, so an in-page nav can highlight the active link.
 *
 * Plain `IntersectionObserver`, no new dependency. Returns `null` until the
 * browser has actually observed an intersecting section — the nav's initial
 * server-rendered markup never depends on this, only the `.active` class
 * added after hydration.
 */
export function useScrollSpy(sectionIds: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = sectionIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) {
      return;
    }

    // Track intersection ratios for every observed section so the most
    // visible one wins, rather than flip-flopping when several sections are
    // simultaneously (barely) inside the viewport margin.
    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        let topId: string | null = null;
        let topRatio = 0;
        ratios.forEach((ratio, id) => {
          if (ratio > topRatio) {
            topRatio = ratio;
            topId = id;
          }
        });

        if (topId !== null) {
          setActiveId(topId);
        }
      },
      {
        // Bias toward sections crossing the upper-middle of the viewport,
        // roughly where a sticky header would leave content visible.
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}
