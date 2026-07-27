/**
 * Experience section for the `/redesign` homepage — real work-history and
 * education timelines plus a real client testimonial.
 *
 * Layout/markup (grid date+content columns, hover-highlight overlay,
 * teal tag pills, arrow-icon title link) mirrors the reference site's
 * actual rendered structure, ground-truthed against a saved copy of its
 * HTML — not approximated from screenshots. The reference has no light
 * mode, so light-mode colors here are this project's own choice, not a
 * ported value.
 *
 * All content, including per-job descriptions/tech tags/related links,
 * is sourced from Laud's résumé (`public/docs/cv/Laud-Tetteh-Resume.pdf`).
 *
 * Server-rendered — no client-only gate. The `group/list` +
 * `lg:group-hover/list:opacity-50` + `lg:hover:!opacity-100` pair on each
 * `<li>` (not a nested div — see e2e test for #48) drives the
 * hover-dims-siblings effect via pure CSS.
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
  companyHref: string;
  description: string;
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
    companyHref: 'https://www.salesforce.com',
    description:
      "Build custom solutions in PHP, JavaScript, MySQL, and YML for Tableau's marketing sites (tableau.com, on Drupal 10), owning projects from discovery through post-release monitoring across 3 US time zones. Lead engineer for a pipeline automating daily extraction of user-submitted assessment data via GitHub Actions and AWS, and rebuilt authentication-gated Product Download pages with a Drupal-UI-toggleable kill switch.",
    techTags: ['PHP', 'Drupal', 'JavaScript', 'MySQL', 'AWS', 'GitHub Actions'],
    relatedLinks: [{ label: 'tableau.com', href: 'https://www.tableau.com' }],
  },
  {
    dateRange: '2019–2021',
    title: 'Senior Dev.',
    company: 'MethodistCRM',
    companyHref: 'https://laudtetteh.io/methodistcrm.html',
    description:
      'Built a CRM dashboard with authentication for community-based church programs, powered by Laravel & MySQL. Shipped reports & dynamic search, notifications, analytics, messaging, an events calendar, branch locator, store, cart, and checkout.',
    techTags: ['Laravel', 'MySQL', 'PHP'],
    relatedLinks: [],
  },
  {
    dateRange: '2014–2021',
    title: 'Senior Dev.',
    company: 'Studio Ten Four, LLC',
    companyHref: 'https://www.studiotenfour.com',
    description:
      "Webmaster and custom plugin development for King County 4Culture, a Washington State non-profit. Built and maintained a Drupal-powered class/course database, personnel directory, events calendar, and password-protected content portal for the University of Hawai'i's William S. Richardson School of Law, then led the data migration when the site rebuilt onto WordPress. Also redesigned the South Seminole and North Orange County Wastewater Transmission Authority site to WCAG 2.2 accessibility compliance.",
    techTags: ['WordPress', 'Drupal', 'PHP', 'Accessibility'],
    relatedLinks: [
      { label: '4culture.org', href: 'https://www.4culture.org' },
      { label: 'law.hawaii.edu', href: 'https://law.hawaii.edu' },
      { label: 'ssnocwta.com', href: 'https://ssnocwta.com' },
    ],
  },
  {
    dateRange: '2016–2017',
    title: 'Front-End Eng.',
    company: 'Moz',
    companyHref: 'https://www.moz.com',
    description:
      'Worked with the Inbound Engineering team migrating portions of moz.com from CakePHP to Craft CMS. Partnered with the UX team translating comps into marketing pages, and with Business Intelligence to implement page-load and event tracking via Adobe DTM and Segment.',
    techTags: ['CraftCMS', 'PHP', 'Adobe DTM', 'Segment'],
    relatedLinks: [],
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
        <ol className="group/list mt-12">
          {experience.map(entry => (
            <li
              key={`${entry.company}-${entry.dateRange}`}
              className="group relative mb-12 transition-opacity motion-reduce:transition-none lg:hover:!opacity-100 lg:group-hover/list:opacity-50"
            >
              <div
                aria-hidden="true"
                className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-100 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(15,23,42,0.06)] lg:group-hover:drop-shadow-lg dark:lg:group-hover:bg-slate-800/50 dark:lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)]"
              />
              <div className="relative grid gap-1 pb-1 sm:grid-cols-8 sm:gap-8 md:gap-4">
                <header className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:col-span-2">
                  {entry.dateRange}
                </header>
                <div className="z-10 sm:col-span-6">
                  <h3 className="font-medium leading-snug text-slate-900 dark:text-slate-200">
                    <a
                      href={entry.companyHref}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group/link inline-flex items-baseline text-base font-medium leading-tight text-slate-900 dark:text-slate-200"
                    >
                      <span>
                        {entry.title}{' '}
                        <span className="inline-flex items-center">
                          @ {entry.company}
                          <ExternalLinkIcon className="ml-1 h-4 w-4 shrink-0 translate-y-px transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 motion-reduce:transition-none" />
                        </span>
                      </span>
                    </a>
                  </h3>
                  <p className="mt-2 text-sm leading-normal text-slate-700 dark:text-slate-400">
                    {entry.description}
                  </p>
                  <ul className="mt-2 flex flex-wrap" aria-label="Technologies used">
                    {entry.techTags.map(tag => (
                      <li key={tag} className="mr-1.5 mt-2">
                        <div className="flex items-center rounded-full bg-teal-600/10 px-3 py-1 text-xs font-medium leading-5 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300">
                          {tag}
                        </div>
                      </li>
                    ))}
                  </ul>
                  {entry.relatedLinks.length > 0 && (
                    <ul className="mt-2 flex flex-wrap" aria-label="Related links">
                      {entry.relatedLinks.map(link => (
                        <li key={link.href} className="mr-4">
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="relative mt-2 inline-flex items-center text-sm font-medium text-slate-600 dark:text-slate-300"
                          >
                            <LinkIcon />
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>

        {/* Education */}
        <div className="mt-16">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Education</h3>
          <ol className="mt-6 space-y-6 border-l border-slate-200 pl-8 dark:border-slate-800">
            {education.map(entry => (
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
      viewBox="0 0 20 20"
      fill="currentColor"
      className="mr-1 h-3 w-3"
      aria-hidden="true"
    >
      <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
      <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
    </svg>
  );
}

function ExternalLinkIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}
