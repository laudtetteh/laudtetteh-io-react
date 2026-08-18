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
  { label: 'Job', value: 'Software Engineer' },
  { label: 'Location', value: 'Seattle, WA' },
  { label: 'Working at', value: 'Salesforce' },
  { label: 'Email', value: 'hello@laudtetteh.io', href: 'mailto:hello@laudtetteh.io' },
  { label: 'Website', value: 'www.laudtetteh.io', href: 'https://www.laudtetteh.io' },
];

const CV_HREF = '/docs/cv/Laud-Tetteh-Resume.pdf';

/** One skills category, grouped into the tool "rows" as they exist in the live content. */
interface SkillCategory {
  category: string;
  /** Each entry is one comma-separated row from the source content (kept as its own row, not flattened). */
  rows: string[][];
}

const SKILLS: SkillCategory[] = [
  {
    category: 'Server Side',
    rows: [
      ['PHP', 'Node.js'],
      ['Laravel', 'WordPress', 'Drupal'],
      ['MySQL', 'MariaDB', 'MongoDB'],
    ],
  },
  {
    category: 'Client Side',
    rows: [['React JS'], ['Bootstrap', 'TailwindCSS'], ['HTML', 'CSS', 'SASS']],
  },
  {
    category: 'Dev-Ops & CI/CD',
    rows: [
      ['GitHub Actions'],
      ['Cypress', 'PHPUnit', 'Playwright'],
      ['Docker', 'AWS', 'Heroku', 'Netlify'],
    ],
  },
  {
    category: 'Others',
    rows: [
      ['Agile', 'Jira', 'GUS', 'Asana'],
      ['New Relic', 'Google Analytics'],
      ['Figma', 'Sketch'],
    ],
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
        <h2 className="text-sm font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
          About
        </h2>

        <p className="mt-6 text-base leading-normal text-slate-700 dark:text-slate-400">
          I&apos;m Laud Tetteh, a Full Stack Web Developer based in Seattle, WA, with 10+
          years of experience building, optimizing, and maintaining web applications for
          clients and employers across the US and Africa. I thrive on learning new
          technologies, collaborating with smart people, and solving real-world problems
          through code. My background spans backend, frontend and DevOps. Let&apos;s build
          something great together!
        </p>

        {/* Info table */}
        <dl className="mt-10 grid grid-cols-1 gap-x-8 gap-y-3 border-t border-slate-200 pt-8 dark:border-slate-800 sm:grid-cols-2">
          {INFO_ITEMS.map(item => (
            <div key={item.label} className="flex items-baseline justify-between gap-4 sm:justify-start">
              <dt className="text-sm text-slate-600 dark:text-slate-400">{item.label}</dt>
              <dd className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-teal-600 underline-offset-4 hover:underline dark:text-teal-400"
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
          className="mt-8 inline-flex items-center gap-2 rounded-md border border-teal-600 px-4 py-2 text-sm font-semibold text-teal-600 transition-colors hover:bg-teal-600 hover:text-slate-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-400 dark:hover:text-slate-900"
        >
          Download CV
        </a>

        {/* Skills */}
        <div className="mt-14 border-t border-slate-200 pt-8 dark:border-slate-800">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
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
