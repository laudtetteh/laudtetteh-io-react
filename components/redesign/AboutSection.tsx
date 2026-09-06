import React from 'react';
import MobileSectionTitle from './MobileSectionTitle';

/** A single row in the "About" info table. */
interface InfoItem {
  label: string;
  value: string;
  /** Present when the value should render as a link (mailto:, external, or file download). */
  href?: string;
  /** Marks the anchor as a same-origin file download rather than a navigation. */
  download?: boolean;
}

const INFO_ITEMS: InfoItem[] = [
  { label: 'Name', value: 'Laud Tetteh' },
  // Title is fixed by DOSSIER §3.2. Never "Senior", "Lead", "Staff", "Principal".
  { label: 'Job', value: 'Software Engineer (MTS)' },
  { label: 'Location', value: 'Seattle, WA' },
  { label: 'Working at', value: 'Salesforce' },
  // Always the personal address — never the employer's (DOSSIER §15.2 item 9).
  { label: 'Email', value: 'hello@laudtetteh.io', href: 'mailto:hello@laudtetteh.io' },
  { label: 'Website', value: 'www.laudtetteh.io', href: 'https://www.laudtetteh.io' },
];

/**
 * Public CV. Rendered from the 2026 two-page résumé with the phone number
 * removed — the file is served from a public URL and gets crawled, so the
 * contact line is email/site/LinkedIn/GitHub only. The full-contact version
 * is kept out of the repo and sent directly with applications.
 */
const CV_HREF = '/docs/cv/Laud-Tetteh-Resume-2026.pdf';

/** One skills category, grouped into the tool "rows" as they exist in the live content. */
interface SkillCategory {
  category: string;
  /** Each entry is one comma-separated row from the source content (kept as its own row, not flattened). */
  rows: string[][];
}

/**
 * Skills, ordered platform-first per `WEBSITE-BRIEF.md` §6 and filtered to the
 * defendable-only list in `DOSSIER.md` §10.1/§10.4 — the standard being "what
 * survives Senior-depth questioning", not "what appears in the stack".
 *
 * Deliberately absent, and not to be re-added without checking §10.4 first:
 * - Node.js, MongoDB, Playwright, TypeScript, Next.js, FastAPI, Python,
 *   GraphQL, Terraform — cut from Skills. Several are accurate *inside* a
 *   project description as system composition; none is a claimable skill.
 * - Redis, Memcache, Acquia, Optimizely, OneTrust — present in the Tableau
 *   platform, but a tool being in a system you work on is not a skill.
 * - Heroku, Netlify, Sketch, Gulp, Grunt, jQuery — dead 2016 tooling.
 * - Agile/Jira/Asana/Figma — process tools carry no signal at this level
 *   (§14.1: "a skills tag cloud proves nothing").
 * - GUS — internal Salesforce work tracker; not marketable and internal-flavoured.
 */
const SKILLS: SkillCategory[] = [
  {
    category: 'Platform & CI/CD',
    rows: [['Docker', 'Docker Compose'], ['GitHub Actions', 'CI/CD architecture'], ['Bash']],
  },
  {
    category: 'Cloud & Delivery',
    rows: [['AWS S3'], ['CloudFront', 'Akamai CDN']],
  },
  {
    category: 'Observability',
    rows: [['New Relic', 'Splunk'], ['Application monitoring', 'Log analysis']],
  },
  {
    category: 'Backend & Data',
    rows: [['PHP', 'Laravel'], ['MySQL', 'MariaDB'], ['REST API design']],
  },
  {
    category: 'CMS & Content',
    rows: [['Drupal', 'WordPress multisite'], ['Config-as-code']],
  },
  {
    category: 'Web & Analytics',
    rows: [['JavaScript', 'React', 'SCSS'], ['GA4', 'Google Tag Manager'], ['DataLayer engineering']],
  },
  {
    category: 'Testing',
    rows: [['Cypress']],
  },
];

/**
 * The new design's About section: real bio, info table, and skills
 * breakdown. Server-rendered — no client-only gate, no hooks.
 */
export default function AboutSection() {
  return (
    <section
      id="about"
      aria-label="About me"
      className="mb-16 scroll-mt-16 border-b border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 md:mb-24 lg:mb-36 lg:scroll-mt-24"
    >
      <MobileSectionTitle title="About" />
      <div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-16">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-teal-700 dark:text-teal-400">
          About
        </h2>

        {/*
          Bio derived from DOSSIER §12.4 Medium. Four deviations from that text are
          deliberate and rule-forced — see WEBSITE-CONTENT-SPEC.md §B.1:
          "co-own" not "own" and the explicit inherited-pipeline boundary (§6.2
          attribution), and "design, build and maintain … a production e-commerce
          platform" rather than "build and run … a live e-commerce business" (§7.2,
          which bans both the verb and that exact phrase).
        */}
        <div className="mt-6 space-y-4 text-base leading-normal text-slate-700 dark:text-slate-400">
          <p>
            I&apos;m Laud Tetteh, a software engineer in Seattle with 12 years of experience
            building and operating web platforms.
          </p>
          <p>
            At Salesforce/Tableau I work on tableau.com — a site drawing roughly 13 million
            visits a month (Semrush estimate, 2026) on a large enterprise Drupal installation.
            I co-own much of the automation behind it: the CI container images, the composite
            Actions our workflows are assembled from, the gated pipeline that deploys to
            production four times a week, and the nightly extract-transform-load job that
            keeps the team on clean data. I didn&apos;t write that pipeline — I inherited it, and I&apos;ve spent four
            years making it better without breaking the team that depends on it. I built the
            site&apos;s public pricing calculator, and I led its analytics re-platform.
          </p>
          <p>I take the release rotation, lead the weekly operations review, and carry the pager.</p>
          <p>
            On my own time I design, build and maintain Beacon Essentials, a production
            e-commerce platform in Ghana, and The Rig, an open-source framework for making AI
            coding agents reliable.
          </p>
        </div>

        {/* Info table */}
        <dl className="mt-10 grid grid-cols-1 gap-x-8 gap-y-3 border-t border-slate-200 pt-8 dark:border-slate-800 sm:grid-cols-2">
          {INFO_ITEMS.map(item => (
            <div key={item.label} className="flex items-baseline justify-between gap-4 sm:justify-start">
              <dt className="text-sm text-slate-600 dark:text-slate-400">{item.label}</dt>
              <dd className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-teal-700 underline-offset-4 hover:underline dark:text-teal-400"
                  >
                    {item.value}
                  </a>
                ) : (
                  item.value
                )}
              </dd>
            </div>
          ))}
        </dl>

        <a
          href={CV_HREF}
          download
          className="mt-8 inline-flex items-center gap-2 rounded-md border border-teal-600 px-4 py-2 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-700 hover:text-slate-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-400 dark:hover:text-slate-900"
        >
          Download CV
        </a>

        {/* Skills */}
        <div className="mt-14 border-t border-slate-200 pt-8 dark:border-slate-800">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-teal-700 dark:text-teal-400">
            Skills
          </h3>

          <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {SKILLS.map(({ category, rows }) => (
              <div key={category}>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {category}
                </h4>
                <div className="mt-3 space-y-2">
                  {rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex flex-wrap gap-2">
                      {row.map(tool => (
                        <span
                          key={tool}
                          className="rounded-full bg-teal-600/10 px-3 py-1 text-xs font-medium leading-5 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
