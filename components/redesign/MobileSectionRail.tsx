import React from 'react';
import classNames from 'classnames';

interface RailItem {
  id: string;
  label: string;
}

interface MobileSectionRailProps {
  items: readonly RailItem[];
  /** Currently visible section, from the same `useScrollSpy` the sidebar uses. */
  activeId: string | null;
}

/**
 * Sticky in-page nav for small screens (#119).
 *
 * Below `lg:` the sidebar stacks at the top of the page and scrolls away, so a
 * five-section single-page document had no wayfinding after the first swipe.
 * This pins a compact rail to the right edge instead: one marker per section,
 * with the active one widening and turning teal.
 *
 * Decisions worth keeping:
 *
 * - **Right edge, not left.** Thumb reach on a phone, and the left edge is
 *   where browser back-gesture zones live on both platforms.
 * - **Labels are `sr-only` at every state, not just inactive ones.** A visible
 *   active label was tried first and rejected: at 390px it printed over the
 *   adjacent card and cut the copy mid-word. The rail overlays content by
 *   design, so it has to stay narrow enough that the overlap lands inside the
 *   cards' own padding. Screen readers and search engines still get "About",
 *   "Experience" and so on — a rail of *unlabelled* dots is the standard
 *   failure of this pattern, and that is what `sr-only` avoids.
 * - **Each link is a 44px-tall hit target** (`min-h-[2.75rem]`) even though the
 *   visible dash is 2px. The dash is chrome; the tap area is what a thumb has
 *   to find. An earlier revision used `py-1.5` and produced ~14px targets —
 *   below both the WCAG 2.5.5 guidance and the 20px floor `responsive.spec.ts`
 *   already enforced.
 * - **`aria-current="location"`**, not `page` — these are in-page anchors
 *   within one document, not separate pages.
 * - **Neutral palette, not teal.** #48 established that the active nav
 *   indicator uses slate rather than the teal accent, and `redesign.spec.ts`
 *   asserts it. Teal was tried here and correctly rejected by that test.
 * - Colours match the #110 audit. Every marker is non-text UI, so the bar is
 *   3:1, not 4.5:1 — there is no visible text in this component at all.
 */
export default function MobileSectionRail({ items, activeId }: MobileSectionRailProps) {
  return (
    <nav
      aria-label="Section"
      className="fixed right-1.5 top-1/2 z-40 -translate-y-1/2 lg:hidden"
    >
      {/* Opaque, not translucent: it sits over cards, and 80% opacity let the
          text behind bleed through the markers. */}
      <ul className="flex flex-col items-end gap-0.5 rounded-full border border-slate-300 bg-slate-50 px-1.5 py-2 shadow-sm shadow-slate-300/40 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30">
        {items.map(item => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? 'location' : undefined}
                className="group flex min-h-[2.75rem] items-center justify-end rounded-sm px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 dark:focus-visible:ring-teal-400"
              >
                <span className="sr-only">{item.label}</span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    'block h-0.5 rounded-full transition-all duration-200 motion-reduce:transition-none',
                    isActive
                      ? 'w-6 bg-slate-900 dark:bg-slate-200'
                      : 'w-3 bg-slate-500 group-hover:w-5 group-hover:bg-slate-700 dark:bg-slate-400 dark:group-hover:bg-slate-200'
                  )}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
