import React, { useId, useState } from 'react';

interface DisclosurePanelProps {
  /** Rendered inside the toggle button. Keep it short — it is the scannable line. */
  label: React.ReactNode;
  /**
   * One-line summary shown while collapsed. It must carry the cluster's actual
   * claim, not tease it: a reader who never expands anything should still leave
   * with the substance. See the copy constraint in `#116`.
   */
  synopsis: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  /** Heading level for the label, so the a11y outline stays correct in context. */
  headingLevel?: 3 | 4 | 5;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-3.5 w-3.5 transition-transform duration-200 motion-reduce:transition-none ${
        open ? 'rotate-180' : ''
      }`}
    >
      <path d="M5 7.5 10 12.5 15 7.5" />
    </svg>
  );
}

/**
 * The chevron sits in a bordered disc rather than floating as a bare caret.
 * A right-aligned caret alone reads as decoration; the disc plus the row's
 * hover tint is what makes the whole line legible as a control (#117 item 2).
 */
function ChevronAffordance({ open }: { open: boolean }) {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition-colors group-hover/disc:border-teal-700 group-hover/disc:text-teal-700 motion-reduce:transition-none dark:border-slate-600 dark:text-slate-400 dark:group-hover/disc:border-teal-400 dark:group-hover/disc:text-teal-400">
      <ChevronIcon open={open} />
    </span>
  );
}

interface ReadMoreProps {
  /** Collapsed summary. Same copy constraint as `DisclosurePanel.synopsis`. */
  synopsis: string;
  /**
   * Names the thing being expanded, for the button's accessible name. Without
   * it every card on the page announces as an identical "Read more", which is
   * the classic repeated-link-text failure.
   */
  title: string;
  children: React.ReactNode;
}

/**
 * Disclosure variant for `ProjectsSection` cards (#116).
 *
 * A project card already renders its title as a link, and a `<button>` cannot
 * be nested inside an `<a>` — so unlike `DisclosurePanel`, the trigger sits
 * *below* the synopsis instead of wrapping the label. Same DOM-retention and
 * reduced-motion guarantees.
 */
export function ReadMore({ synopsis, title, children }: ReadMoreProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const contentId = `${id}-content`;

  return (
    <>
      {/* Goes `sr-only` once open, matching DisclosurePanel. The synopsis is a
          compression of the body's own opening sentence, so leaving it visible
          while expanded prints that sentence twice — most visibly on the arc
          projects, whose synopses deliberately reuse the connective phrase. */}
      <p
        className={`mt-2 text-sm leading-normal text-slate-700 dark:text-slate-400 ${
          open ? 'sr-only' : ''
        }`}
      >
        {synopsis}
      </p>

      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className={`overflow-hidden ${open ? '' : 'invisible'}`}>
          <div id={contentId} className="space-y-2 pt-2">
            {children}
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        aria-label={`${open ? 'Show less about' : 'Read more about'} ${title}`}
        onClick={() => setOpen(v => !v)}
        className="group/disc mt-2 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-teal-700 transition-colors hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 motion-reduce:transition-none dark:text-teal-400 dark:hover:text-teal-300 dark:focus-visible:ring-teal-400 dark:focus-visible:ring-offset-slate-900"
      >
        {open ? 'Show less' : 'Read more'}
        <ChevronAffordance open={open} />
      </button>
    </>
  );
}

/**
 * Accessible expand/collapse used by the Experience clusters and the grouped
 * Projects cards (#116).
 *
 * Three decisions worth not undoing:
 *
 * 1. **The body stays in the DOM when collapsed.** It is hidden with
 *    `grid-template-rows: 0fr` + `invisible`, never conditionally rendered.
 *    `invisible` removes it from the accessibility tree and the tab order, so
 *    it behaves correctly for assistive tech, while crawlers and "view source"
 *    still see the full text. Conditionally rendering it would strip real
 *    content out of the SSR HTML — on a portfolio whose whole job is being read
 *    by recruiters and search engines, that is a regression, not an
 *    optimisation.
 * 2. **The trigger is a real `<button>`** with `aria-expanded` and
 *    `aria-controls`, not a click handler on a heading. The heading wraps the
 *    button so the outline is unchanged.
 * 3. **The chevron and the row both animate under `motion-reduce`.** The
 *    `grid-template-rows` technique is used because it animates to intrinsic
 *    height without measuring, so no layout thrash and no hardcoded max-height
 *    that silently clips long clusters.
 */
export default function DisclosurePanel({
  label,
  synopsis,
  children,
  defaultOpen = false,
  headingLevel = 4,
}: DisclosurePanelProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const contentId = `${id}-content`;
  const Heading = `h${headingLevel}` as 'h4';

  return (
    <div>
      <Heading>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={contentId}
          onClick={() => setOpen(v => !v)}
          className="group/disc -mx-2 flex w-full items-center justify-between gap-3 rounded-md px-2 py-1.5 text-left text-xs font-semibold uppercase tracking-widest text-teal-700 transition-colors hover:bg-slate-200/50 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 motion-reduce:transition-none dark:text-teal-400 dark:hover:bg-slate-800/60 dark:hover:text-teal-300 dark:focus-visible:ring-teal-400 dark:focus-visible:ring-offset-slate-900"
        >
          <span>{label}</span>
          <ChevronAffordance open={open} />
        </button>
      </Heading>

      {/* Always rendered so the synopsis reads as the collapsed summary rather
          than disappearing the moment the panel opens. */}
      <p
        className={`mt-1.5 text-sm leading-normal text-slate-700 dark:text-slate-400 ${
          open ? 'sr-only' : ''
        }`}
      >
        {synopsis}
      </p>

      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className={`overflow-hidden ${open ? '' : 'invisible'}`}>
          <div id={contentId} className="mt-2 space-y-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
