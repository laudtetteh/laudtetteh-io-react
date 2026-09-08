interface MobileSectionTitleProps {
  title: string;
}

/**
 * Mobile/tablet-only sticky bar showing the current section's name pinned
 * at the top of the viewport while scrolling — ported from the reference
 * design's per-section title bar (`sticky top-0 z-20 ... backdrop-blur`,
 * hidden at `lg:` where the sidebar nav already serves that purpose).
 *
 * `aria-hidden`: each section already carries its own real, accessible
 * heading elsewhere in its content — this bar is a purely visual scroll
 * affordance, not a second heading, so it's hidden from the accessibility
 * tree to avoid announcing the section name twice.
 */
export default function MobileSectionTitle({ title }: MobileSectionTitleProps) {
  return (
    <div
      aria-hidden="true"
      data-mobile-section-title={title}
      className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-50/75 px-6 py-5 backdrop-blur dark:bg-slate-900/75 md:-mx-12 md:px-12 lg:hidden"
    >
      <p className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200">
        {title}
      </p>
    </div>
  );
}
