/**
 * Experience section for the `/redesign` homepage — real work-history and
 * education timelines plus a real client testimonial.
 *
 * All content, including per-job achievement bullets/tech tags/related
 * links, is sourced from Laud's résumé (`public/docs/cv/Laud-Tetteh-Resume.pdf`).
 *
 * Server-rendered — no client-only gate, no interactivity required beyond
 * the pure-CSS hover-dims-siblings effect on the work-history timeline
 * (`group/list` on the `<ol>`, `group-hover/list:opacity-50` +
 * `hover:!opacity-100` per entry — ported from the reference, verified live).
 */

import MobileSectionTitle from './MobileSectionTitle';

interface RelatedLink {
  label: string;
  href: string;
}

interface ExperienceEntry {
  dateRange: string;
  title: string;
  company: string;
  bullets: string[];
  techTags: string[];
  relatedLinks: RelatedLink[];
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
    bullets: [
      "Build custom solutions in PHP, JavaScript, MySQL, and YML for Tableau's marketing sites (tableau.com, on Drupal 10), owning projects from discovery through post-release monitoring across 3 US time zones.",
      "Lead engineer for a pipeline automating daily extraction of user-submitted assessment data from a Dockerized MariaDB image via GitHub Actions, authenticating with AWS IAM and uploading to S3 for the Decision Science team's analysis.",
      'Rebuilt authentication-gated Product Download pages with a Drupal-UI-toggleable kill switch, backed by unit tests.',
    ],
    techTags: ['PHP', 'Drupal', 'JavaScript', 'MySQL', 'AWS', 'GitHub Actions'],
    relatedLinks: [{ label: 'tableau.com', href: 'https://www.tableau.com' }],
  },
  {
    dateRange: '2019–2021',
    title: 'Senior Dev.',
    company: 'MethodistCRM',
    bullets: [
      'Built a CRM dashboard with authentication for community-based church programs, powered by Laravel & MySQL.',
      'Shipped reports & dynamic search, notifications, analytics, messaging, an events calendar, branch locator, store, cart, and checkout.',
    ],
    techTags: ['Laravel', 'MySQL', 'PHP'],
    relatedLinks: [{ label: 'laudtetteh.io/methodistcrm.html', href: 'https://laudtetteh.io/methodistcrm.html' }],
  },
  {
    dateRange: '2014–2021',
    title: 'Senior Dev.',
    company: 'Studio Ten Four, LLC',
    bullets: [
      'Webmaster and custom plugin development for King County 4Culture (4culture.org), a Washington State non-profit.',
      "Built and maintained a Drupal-powered class/course database, personnel directory, events calendar, and password-protected content portal for the University of Hawai'i's William S. Richardson School of Law, then led the data migration when the site rebuilt onto WordPress.",
      'Redesigned and rebuilt the South Seminole and North Orange County Wastewater Transmission Authority site (ssnocwta.com) to WCAG 2.2 accessibility compliance.',
    ],
    techTags: ['WordPress', 'Drupal', 'PHP', 'Accessibility'],
    relatedLinks: [
      { label: '4culture.org', href: 'https://www.4culture.org' },
      { label: 'law.hawaii.edu', href: 'https://www.law.hawaii.edu' },
      { label: 'ssnocwta.com', href: 'https://ssnocwta.com' },
    ],
  },
  {
    dateRange: '2016–2017',
    title: 'Front-End Eng.',
    company: 'Moz',
    bullets: [
      'Worked with the Inbound Engineering team migrating portions of moz.com from CakePHP to Craft CMS.',
      'Partnered with the UX team translating comps into marketing pages, and with Business Intelligence to implement page-load and event tracking via Adobe DTM and Segment.',
    ],
    techTags: ['CraftCMS', 'PHP', 'Adobe DTM', 'Segment'],
    relatedLinks: [{ label: 'moz.com', href: 'https://www.moz.com' }],
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
      className="mb-16 scroll-mt-16 bg-slate-50 dark:bg-slate-900 md:mb-24 lg:mb-36 lg:scroll-mt-24"
    >
      <MobileSectionTitle title="Experience" />
      <div className="mx-auto max-w-4xl px-6 sm:px-10 lg:px-16">
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
        <ol className="group/list mt-12 space-y-10 border-l border-slate-200 pl-8 dark:border-slate-800">
          {experience.map((entry) => (
            <li
              key={`${entry.company}-${entry.dateRange}`}
              className="group relative transition-opacity motion-reduce:transition-none lg:hover:!opacity-100 lg:group-hover/list:opacity-50"
            >
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
                <div className="mt-3 flex flex-wrap gap-3 text-xs">
                  {entry.relatedLinks.map(link => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-slate-600 transition-colors hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
                    >
                      <LinkIcon />
                      {link.label}
                    </a>
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

function LinkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
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
