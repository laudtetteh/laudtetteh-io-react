import { inter } from '@/lib/fonts';
import type { GithubRepo } from '@/types/github';
import type { PostData } from '@/types/blog';
import Header from './Header';
import AboutSection from './AboutSection';
import ExperienceSection from './ExperienceSection';
import ProjectsSection from './ProjectsSection';
import SandboxSection from './SandboxSection';
import WritingSection from './WritingSection';
import ContactSection from './ContactSection';
import Footer from './Footer';
import { useSpotlight } from './hooks/useSpotlight';

interface RedesignLayoutProps {
  repos: GithubRepo[];
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
 * tracks the raw viewport pointer position and this component paints it as
 * a radial-gradient glow on a `fixed`/`lg:absolute` overlay positioned
 * relative to the outermost `group/spotlight` wrapper, ported like-for-like
 * from the reference (verified live against `https://brittanychiang.com`).
 */
export default function RedesignLayout({ repos, posts }: RedesignLayoutProps) {
  const spotlightBackground = useSpotlight();

  return (
    <div className={`${inter.variable} font-inter group/spotlight relative`}>
      <div
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
            <SandboxSection repos={repos} />
            <WritingSection posts={posts} />
            <ContactSection />
            <Footer />
          </main>
        </div>
      </div>
    </div>
  );
}
