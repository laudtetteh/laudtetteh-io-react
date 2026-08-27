import { inter } from '@/lib/fonts';
import type { PostData } from '@/types/blog';
import Header from './Header';
import AboutSection from './AboutSection';
import ExperienceSection from './ExperienceSection';
import ProjectsSection from './ProjectsSection';
import WritingSection from './WritingSection';
import ContactSection from './ContactSection';
import Footer from './Footer';
import { useSpotlight } from './hooks/useSpotlight';

interface RedesignLayoutProps {
  posts: PostData[];
}

/**
 * Page shell for the redesigned homepage: a real two-column layout — a
 * sticky left sidebar (`Header`, `lg:w-[48%]`) beside an independently
 * scrolling right content column (`<main id="content">`, `lg:w-[52%]`) —
 * matching the reference site's actual architecture pixel-for-pixel (see
 * `TASK_redesign-two-column-shell.md`, #48). Below `lg:` both columns stack
 * full-width in document order.
 *
 * Also owns the mouse-tracking spotlight cursor effect: `useSpotlight`
 * tracks the pointer relative to the overlay's own live bounding rect
 * (correct whether the overlay is currently `fixed` or `lg:absolute` — see
 * the hook's own doc comment for why raw viewport coordinates alone drift
 * off-cursor after scrolling at desktop widths) and this component paints
 * it as a radial-gradient glow on that overlay, positioned relative to the
 * outermost `group/spotlight` wrapper.
 */
export default function RedesignLayout({ posts }: RedesignLayoutProps) {
  const { background: spotlightBackground, ref: spotlightRef } = useSpotlight();

  return (
    <div
      className={`${inter.variable} font-inter group/spotlight relative selection:bg-teal-300 selection:text-teal-900`}
    >
      <a
        href="#content"
        className="absolute left-0 top-0 z-50 block -translate-x-full rounded bg-teal-600 px-4 py-3 text-sm font-bold uppercase tracking-widest text-white focus:outline-none focus-visible:translate-x-0 focus-visible:ring-2 focus-visible:ring-teal-300 dark:bg-teal-400 dark:text-slate-900"
      >
        Skip to Content
      </a>

      <div
        ref={spotlightRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-30 transition duration-300 lg:absolute"
        style={{ background: spotlightBackground }}
      />

      <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-16 lg:py-0">
        <div className="lg:flex lg:justify-between lg:gap-4">
          <Header />

          <main id="content" className="pt-24 lg:w-[52%] lg:py-24">
            <AboutSection />
            <ExperienceSection />
            <ProjectsSection />
            {/*
              Sandbox is intentionally not rendered (#101, 2026-08-27). The
              GitHub API returns 11 public repos, 8 of which match the section's
              topic filter — and all 8 were last pushed in 2021, so the section
              was rendering direct evidence for the "stopped shipping in 2021"
              impression the 2026 content pass exists to correct. `the-rig` is
              public and current but carries no topics, so the filter excludes it.

              The fix lives in the GitHub account, not here. `SandboxSection.tsx`
              and `lib/github.ts` are deliberately left intact and unmodified, so
              restoring this is purely additive: re-add the import, the `repos`
              prop, and the `getSandboxRepos()` call in `pages/index.tsx`.
              Tracked in #108, which also records that the topics recommended in
              DOSSIER §12.5 do not intersect this filter, and that `devops` and
              `ci-cd` must be added to `the-rig` alongside them.
            */}
            <WritingSection posts={posts} />
            <ContactSection />
          </main>
        </div>
      </div>

      {/*
        Deliberately a sibling of the two-column grid, not a child of <main>.
        Footer is styled as a full-bleed band (top border + background), so
        nesting it inside the `lg:w-[52%]` main column made it stop halfway
        across the page at desktop widths and squeezed its contents into a
        narrow strip (#83). Outside the grid it spans the viewport, and
        <footer> as a sibling of <main> is also the more correct semantics.
      */}
      <Footer />
    </div>
  );
}
