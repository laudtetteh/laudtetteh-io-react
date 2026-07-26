import React from 'react';

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
 * "Korok seeds" hover easter egg, ported from the reference design.
 *
 * 11 sibling `<span>`s (one per character of "Korok seeds") each carry a
 * staggered `transition-delay`, so hovering the phrase triggers a per-letter
 * color cascade rather than every letter changing at once. Purely
 * CSS/JSX — no JS, no state. The custom cursor image is applied to the
 * group wrapper via a Tailwind arbitrary value so it's active for the whole
 * hover target, not just individual letters.
 */
const KOROK_LETTERS = ['K', 'o', 'r', 'o', 'k', ' ', 's', 'e', 'e', 'd', 's'] as const;

const KOROK_LETTER_STYLES = [
  'group-hover/korok:text-rose-500 dark:group-hover/korok:text-rose-400 delay-[50ms]',
  'group-hover/korok:text-orange-500 dark:group-hover/korok:text-orange-400 delay-[75ms]',
  'group-hover/korok:text-amber-500 dark:group-hover/korok:text-amber-400 delay-[100ms]',
  'group-hover/korok:text-yellow-500 dark:group-hover/korok:text-yellow-400 delay-[125ms]',
  'group-hover/korok:text-lime-500 dark:group-hover/korok:text-lime-400 delay-[150ms]',
  'group-hover/korok:text-green-500 dark:group-hover/korok:text-green-400 delay-[175ms]',
  'group-hover/korok:text-emerald-500 dark:group-hover/korok:text-emerald-400 delay-[200ms]',
  'group-hover/korok:text-teal-500 dark:group-hover/korok:text-teal-400 delay-[225ms]',
  'group-hover/korok:text-cyan-500 dark:group-hover/korok:text-cyan-400 delay-[250ms]',
  'group-hover/korok:text-blue-500 dark:group-hover/korok:text-blue-400 delay-[275ms]',
  'group-hover/korok:text-violet-500 dark:group-hover/korok:text-violet-400 delay-[300ms]',
] as const;

/**
 * The new design's About section: real bio, info table, skills breakdown,
 * and the ported Korok-seed hover easter egg. Server-rendered — no
 * client-only gate, no hooks, no interactivity beyond pure-CSS hover state.
 */
export default function AboutSection() {
  return (
    <section
      id="about"
      aria-label="About me"
      className="border-b border-slate-200 bg-slate-50 px-6 py-16 text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-3xl">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
          About
        </h2>

        <p className="mt-6 text-base leading-relaxed text-slate-900 dark:text-slate-100 sm:text-lg">
          I&apos;m Laud Tetteh, a Full Stack Web Developer based in Seattle, WA, with 10+
          years of experience building, optimizing, and maintaining web applications for
          clients and employers across the US and Africa. I thrive on learning new
          technologies, collaborating with smart people, and solving real-world problems
          through code. My background spans backend, frontend and DevOps. Let&apos;s build
          something great together!
        </p>

        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          Psst — hover{' '}
          <span
            className="group/korok inline-flex cursor-[url('/images/koroks/Elma.png'),_pointer] font-medium"
            aria-hidden="true"
          >
            {KOROK_LETTERS.map((letter, index) => (
              <span
                key={index}
                className={`transition-colors duration-300 ease-out ${KOROK_LETTER_STYLES[index]}`}
              >
                {letter === ' ' ? ' ' : letter}
              </span>
            ))}
          </span>{' '}
          <span className="sr-only">Korok seeds</span> for a little surprise.
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
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
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
