/**
 * Experience section for the `/redesign` homepage — real work-history and
 * education timelines plus a real client testimonial.
 *
 * Content is real (sourced from `rebuild-spike--live-content-inventory.md`),
 * but the reference design's per-job structure (achievement bullets, tech
 * tags, related links) has no equivalent granularity in Laud's actual
 * inventory. Those sub-fields ship as bracketed placeholders rather than
 * fabricated detail — a content-fill item for Laud later, not a decision
 * made by this component.
 *
 * Server-rendered — no client-only gate, no interactivity required.
 */

interface ExperienceEntry {
  dateRange: string;
  title: string;
  company: string;
  bullets: string[];
  techTags: string[];
  relatedLinks: string[];
}

interface EducationEntry {
  institution: string;
  degree: string;
  field: string;
  year: string;
}

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

const experience: ExperienceEntry[] = [
  {
    dateRange: '2021–Present',
    title: 'Software Eng.',
    company: 'Salesforce',
    bullets: ['[Achievement bullet]', '[Achievement bullet]'],
    techTags: ['[Tech tag]', '[Tech tag]', '[Tech tag]'],
    relatedLinks: ['[Related link]'],
  },
  {
    dateRange: '2019–2021',
    title: 'Senior Dev.',
    company: 'MethodistCRM',
    bullets: ['[Achievement bullet]', '[Achievement bullet]'],
    techTags: ['[Tech tag]', '[Tech tag]', '[Tech tag]'],
    relatedLinks: ['[Related link]'],
  },
  {
    dateRange: '2014–2021',
    title: 'Senior Dev.',
    company: 'Studio Ten Four, LLC',
    bullets: ['[Achievement bullet]', '[Achievement bullet]'],
    techTags: ['[Tech tag]', '[Tech tag]', '[Tech tag]'],
    relatedLinks: ['[Related link]'],
  },
  {
    dateRange: '2016–2017',
    title: 'Front-End Eng.',
    company: 'Moz',
    bullets: ['[Achievement bullet]', '[Achievement bullet]'],
    techTags: ['[Tech tag]', '[Tech tag]', '[Tech tag]'],
    relatedLinks: ['[Related link]'],
  },
];

const education: EducationEntry[] = [
  {
    institution: 'Central University College, Ghana',
    degree: 'BA',
    field: 'Business Administration',
    year: '2008',
  },
  {
    institution: 'Cape Coast Polytechnic, Ghana',
    degree: 'HND',
    field: 'Civil Engineering',
    year: '2005',
  },
];

const testimonial: Testimonial = {
  quote:
    'Laud was awesome to work with at Moz. As a marketer, I appreciated his communication style the most as well as his speediness. My job was to request new landing pages and updates to our marketing pages… I really appreciated that. I\'d recommend Laud for any marketer or designer looking for a front end developer, and to any dev team who can work well with marketers. He also has a great can-do attitude, adorable twins, and a super solid goal to help his community.',
  author: 'Brittani Dinsmore',
  role: 'Marketing Leader, Moz',
};

export default function ExperienceSection() {
  return (
    <section
      id="experience"
      data-redesign-section="experience"
      aria-labelledby="experience-heading"
      className="bg-slate-50 px-6 py-20 dark:bg-slate-900 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2
            id="experience-heading"
            className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl"
          >
            Experience
          </h2>
          <a
            href="/docs/cv/Laud-Tetteh-Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-teal-600 transition-colors hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
          >
            View Full Résumé
            <ExternalLinkIcon />
          </a>
        </div>

        {/* Work history timeline */}
        <ol className="mt-12 space-y-10 border-l border-slate-200 pl-8 dark:border-slate-800">
          {experience.map((entry) => (
            <li key={`${entry.company}-${entry.dateRange}`} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[2.15rem] top-1.5 h-3 w-3 rounded-full border-2 border-teal-600 bg-slate-50 dark:border-teal-400 dark:bg-slate-900"
              />
              <p className="text-sm font-medium text-teal-600 dark:text-teal-400">
                {entry.dateRange}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {entry.title}{' '}
                <span className="text-slate-600 dark:text-slate-400">@ {entry.company}</span>
              </h3>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                {entry.bullets.map((bullet, index) => (
                  <li key={index} className="flex gap-2">
                    <span aria-hidden="true">–</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-2">
                {entry.techTags.map((tag, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-slate-200 px-2.5 py-0.5 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {entry.relatedLinks.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-400">
                  {entry.relatedLinks.map((link, index) => (
                    <span key={index}>{link}</span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ol>

        {/* Education */}
        <div className="mt-16">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Education</h3>
          <ol className="mt-6 space-y-6 border-l border-slate-200 pl-8 dark:border-slate-800">
            {education.map((entry) => (
              <li key={`${entry.institution}-${entry.year}`} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[2.15rem] top-1.5 h-3 w-3 rounded-full border-2 border-teal-600 bg-slate-50 dark:border-teal-400 dark:bg-slate-900"
                />
                <p className="text-sm font-medium text-teal-600 dark:text-teal-400">{entry.year}</p>
                <h4 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
                  {entry.institution}
                </h4>
                <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                  {entry.degree}, {entry.field}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Testimonial */}
        <figure className="mt-16 border-t border-slate-200 pt-10 dark:border-slate-800">
          <blockquote className="text-lg italic text-slate-900 dark:text-slate-100">
            <p>&ldquo;{testimonial.quote}&rdquo;</p>
          </blockquote>
          <figcaption className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            — <span className="font-medium text-slate-900 dark:text-slate-100">{testimonial.author}</span>,{' '}
            {testimonial.role}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
