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
  {
    // Every term here is on DOSSIER §13's defensible list. Deliberately no
    // model or vendor names beyond the tool actually used daily — §10.4's rule
    // is that a tool present in a system you work on is not a skill you can
    // defend.
    category: 'AI & Agentic Engineering',
    rows: [['Agentic AI', 'LLM tooling'], ['MCP (Model Context Protocol)'], ['Claude Code', 'Developer tooling']],
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
          Re-sequenced 2026-09-06 around the "hybrid engineer" framing Laud
          approved: the arc from self-taught hand-coder to building the tooling
          that makes AI agents dependable, with both halves stated as
          load-bearing. Derived from DOSSIER §12.4 Medium plus §5.0.1's
          Narrative A + B, which exist for exactly this pairing.

          Two ordering decisions, both deliberate:

          - **Product engineering comes before pipeline.** §14.4 sets the pillar
            balance at 40% platform / 30% product and calls product "currently
            thinnest, needs the most growth"; §17.2's unactioned feedback says he
            must read as a product engineer, not only a pipeline engineer.
            Platform is still the larger share by volume — it leads the third
            paragraph — but it no longer arrives first.
          - **Non-coding evidence is shown, never asserted.** §9 is explicit:
            never write "senior-level", show the evidence and let the reader
            conclude. Hence "I asked for the on-call rotation" rather than any
            adjective about initiative.

          Rule-forced wording that must survive future edits: "co-own" not "own"
          and the explicit inherited-pipeline boundary (§6.2 attribution);
          "extended" for the pricing calculator, never "built" or "rebuilt"
          (corrected 2026-09-05, the fourth attribution inflation); "design,
          build and maintain ... a production e-commerce platform" rather than
          "run ... a live e-commerce business" (§7.2).
        */}
        <div className="mt-6 space-y-4 text-base leading-normal text-slate-700 dark:text-slate-400">
          <p>
            I&apos;m Laud Tetteh, a software engineer in Seattle. I started out hand-coding
            everything, taught myself in public, and spent 12 years learning how web
            platforms actually behave under load, under deadline, and under other people&apos;s
            deployment mistakes. These days a lot of my work is building the scaffolding that
            makes AI coding agents dependable on real codebases. Both halves are load-bearing:
            the second only works because of the first.
          </p>
          <p>
            At Salesforce/Tableau I work on tableau.com — a site drawing roughly 13 million
            visits a month (Semrush estimate, 2026) on a large enterprise Drupal installation.
            The product side is the part I like most: I extended the public pricing calculator
            across its UI, API design and backend, authored the architecture for a bulk
            content-ingestion system that moves up to 100 nodes in one operation, and rebuilt
            the authentication gating on product download pages with a kill switch operators
            can flip from the CMS — because the useful question about a gate isn&apos;t whether
            it works, it&apos;s how fast you can turn it off at 2am.
          </p>
          <p>
            I also co-own much of the automation underneath: the CI container images, the
            composite Actions our workflows are assembled from, the gated pipeline that deploys
            four times a week unattended, the nightly job that keeps everyone on clean data, and
            the Akamai edge configuration in front of all of it. I didn&apos;t write that
            pipeline — I inherited it, and I&apos;ve spent four years making it better without
            breaking the team that depends on it.
          </p>
          <p>
            The parts that aren&apos;t code matter just as much. I take the release rotation and
            sign off the change request. I&apos;ve led the weekly operations review for about two
            years. I asked for the on-call rotation rather than waiting to be assigned it, then
            wrote the working agreement that governs it — what counts as a page, what waits until
            morning, what a responder owes the next shift — which went from draft to org-wide
            inside a quarter.
          </p>
          <p>
            On my own time I built LaudBot, hit the wall every engineer working with AI agents
            hits, and generalized the fix into The Rig — an open-source framework giving agents
            persistent memory, enforced workflows, and a git-hook layer that won&apos;t let a
            commit through unscanned. Then I used it to ship Beacon Essentials, a production
            e-commerce platform in Ghana. That&apos;s the whole shape of how I work: build it,
            find where it breaks, fix the class of problem rather than the instance.
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
