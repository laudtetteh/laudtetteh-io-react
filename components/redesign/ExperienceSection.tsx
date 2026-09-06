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
 * All content, including per-job descriptions/tech tags/related links, is
 * governed by the approved content spec at
 * `$RIG_DIR/docs/career/WEBSITE-CONTENT-SPEC.md` §C, which cites a dossier
 * item ID for every factual claim. Do not edit copy here without checking it —
 * several phrasings are load-bearing for attribution and confidentiality
 * reasons that are not obvious from the text alone.
 *
 * Server-rendered — no client-only gate. The `group/list` +
 * `lg:group-hover/list:opacity-50` + `lg:hover:!opacity-100` pair on each
 * `<li>` (not a nested div — see e2e test for #48) drives the
 * hover-dims-siblings effect via pure CSS.
 */

import MobileSectionTitle from './MobileSectionTitle';
import DisclosurePanel from './DisclosurePanel';

interface RelatedLink {
  label: string;
  href: string;
}

/**
 * A labelled block of detail within a role. Only the Salesforce entry uses
 * these: it carries ~65% of the section's weight, and a visitor arriving from
 * any of the five audiences in WEBSITE-BRIEF §3 needs to find their evidence
 * within one scroll. A single prose blob can't do that; labelled clusters can.
 */
interface ExperienceCluster {
  label: string;
  /**
   * The collapsed-state summary (#116). Compressed from this cluster's own
   * approved paragraphs — never a new claim — so every dossier item ID and
   * §6.2 attribution verb survives. A reader who expands nothing still gets
   * the substance.
   */
  synopsis: string;
  paragraphs: string[];
}

interface ExperienceEntry {
  dateRange: string;
  title: string;
  company: string;
  companyHref: string;
  /** Role qualifier shown under the title, e.g. the specific team. */
  subtitle?: string;
  description: string;
  /** Optional depth layer rendered beneath `description`. */
  clusters?: ExperienceCluster[];
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

/**
 * Work history. Content is governed by `docs/career/WEBSITE-CONTENT-SPEC.md` §C,
 * which cites a dossier item ID for every claim. Three rules bind this file:
 *
 * 1. **Title.** "Software Engineer (MTS)" — never "Senior", "Lead", "Staff" or
 *    "Principal" (§3.3). The previous version used "Senior Dev." twice.
 * 2. **Attribution.** Tableau CI/CD is an *inherited* system (§6.2): use
 *    co-own / maintain / optimized / improved, never built / designed / own of
 *    the pipeline as a whole. `SF-CI-05` and `SF-CI-10` are the exceptions —
 *    tagged INDIVIDUAL, so strong verbs are correct for those two only.
 *    Per-client attribution in the agency era varies and must not be
 *    generalised: UH Law was INHERITED, SSNOCWTA was BUILT.
 * 3. **Beacon Avenue is not employment** (§7.2). MethodistCRM previously
 *    appeared here as a 2019–2021 employer, which presented a self-built
 *    project as a job — a background-check surface. It now lives in Projects.
 */
const experience: ExperienceEntry[] = [
  {
    dateRange: 'Oct 2021 – Present',
    title: 'Software Engineer (MTS)',
    company: 'Salesforce',
    companyHref: 'https://www.salesforce.com',
    subtitle: 'Tableau Marketing Engineering',
    description:
      'I work on tableau.com — a top-5,400 global site drawing roughly 13 million visits a month (Semrush estimate, August 2026), running a large enterprise Drupal installation of about 58 custom modules, 3,500 configuration files, and a hundred-spec end-to-end test suite.',
    clusters: [
      {
        label: 'Platform & CI/CD',
        synopsis:
          'I co-own the automation that moves code and data through our environments — a five-image CI container suite, reusable composite Actions, a gated pipeline that ships four releases a week unattended, and the CDN delivery layer in front of all of it.',
        paragraphs: [
          'I co-own the automation that moves code and data through our environments. I didn’t write this pipeline — I inherited it, and I’ve spent four years making it measurably better without breaking the team that depends on it. That’s a five-image CI container suite in a private registry, reusable composite Actions covering dependency caching, test setup and registry auth, and a gated pipeline promoting integration → dev → test → production with commit-SHA parity checks at each hop and a programmatic gate that blocks the production deploy if the previous stage’s checks didn’t pass. Four releases a week run unattended. A nightly ETL — extract, transform, load — clones production down to test and dev, prunes and sanitizes it, and provisions test users, so every engineer starts the day on realistic, safe data.',
          'I also do a lot of the delivery work in front of the application. I rolled out Brotli compression for asset delivery at the CDN edge, create and maintain our Akamai property configurations, and run and monitor the phased-release cloudlets that traffic moves through during a cutover. The edge is the layer where a bad rule is visible to everyone the moment it goes live, so most of the job is being careful before it does.',
          'Two pieces are mine outright. I designed the branch-scoped dependency cache keys that eliminated a cross-environment cache-poisoning failure mode — a class of intermittent build failure that is genuinely hard to see. And I own credential rotation across cloud IAM, source control and service accounts, always verifying a clean deploy on the new keys before retiring the old ones.',
        ],
      },
      {
        label: 'Product engineering',
        synopsis:
          'I extended an existing pricing product inside the legacy Tableau platform, contributed to the architecture for bulk content ingestion, and updated product-download gating with an operator kill switch.',
        paragraphs: [
          'The Pricing Calculator leads Projects below, where the useful question is what the public tool does. In the role history, the useful question is how it shipped: I extended an existing product inside a legacy Drupal platform instead of rebuilding it, negotiated payload contracts with the frontend team, moved multi-currency logic and cached exchange rates server-side, and covered the flow with accessibility, analytics and Cypress work.',
          'I also contributed to the technical architecture for a bulk content-ingestion system that moves up to 100 CMS nodes in a single operation, implemented both its admin interface and its backend, and ran cross-team user acceptance testing that deliberately fed it out-of-order payloads to prove it wouldn’t corrupt state. And I updated the authentication gating on product download pages with a kill switch operators can flip from the CMS — because the useful question about a gate isn’t whether it works, it’s how fast you can turn it off at 2am.',
        ],
      },
      {
        label: 'Analytics engineering',
        synopsis:
          'A decade of marketing-analytics engineering, including the GA4 data-layer re-platform that effectively every conversion event the marketing organization measures runs through.',
        paragraphs: [
          'I’ve been doing marketing-analytics engineering for a decade. It started at Moz in 2016 with Adobe DTM and Segment, and at Tableau I led the site’s GA4 data-layer re-platform — ten-plus event types, custom deduplication so nothing double-counts, consent-aware cookie handling, and customer-relationship-management (CRM) interactions integration. Effectively every conversion event the marketing organization measures runs through it. I also built metadata export tooling that lets analysts join traffic data against CMS metadata; it has been reused across two migrations and re-requested more than a year after I first built it.',
        ],
      },
      {
        label: 'Platform migration',
        synopsis:
          'Contributing engineer on the multi-year re-platform off Drupal onto a consolidated enterprise WordPress multisite, and the edge work in front of it — 469 legacy redirects inventoried, 466 migrated to a CDN edge policy, three deliberately held back.',
        paragraphs: [
          'I’m a contributing engineer on the multi-year re-platform of the site off Drupal and onto a consolidated enterprise WordPress multisite with a decoupled Node.js frontend — content transformation, Terraform-managed environment configuration, GraphQL integration, and phased traffic cutover at the CDN, without interrupting global marketing operations.',
          'The redirect migration is the part I’d point at. I inventoried 469 legacy redirects, separated 466 clean ones from three with semantics that needed their own owner decisions, imported the clean set into a CDN edge policy, and validated the exported policy against the import row by row before activating it in production. Holding three rows back was the whole point — bundling them would have hidden real risk inside a large mechanical migration.',
        ],
      },
      {
        label: 'Leadership, release & reliability',
        synopsis:
          'I review more code than I write — 208 pull requests reviewed against 134 opened, across six repositories. I also lead the weekly operations review, contributed to the on-call working agreement that went org-wide inside a quarter, and take the release rotation as Release Engineer of record.',
        paragraphs: [
          'I take the release rotation as Release Engineer of record — owning user acceptance testing and production deployment coordination, and signing off the change request. For about two years I’ve led our weekly operations review, where post-deployment triage happens and where I report site health, production errors and open issues to stakeholders. I asked for that rotation. I’m on the on-call roster, and I contributed to the working agreement that governs it — what constitutes a page, what waits until morning, what a responder owes the next shift — which went from draft to org-wide adoption inside a quarter.',
          'Most of my influence on this codebase is not my own commits. I review more pull requests than I author — 208 against 134 — across six repositories including ones I don’t own, and I’m one of the people who integrates other engineers’ work into the platform. When product download links started intermittently 404ing, I ran the investigation: quantified the blast radius from logs at roughly three thousand affected users, traced it to a build artifact that never landed in a gated storage bucket, and coordinated the fix with release engineering. I led a cross-team discovery comparing observability platforms for properties moving onto the new architecture, engaging three partner teams to set the organization’s forward monitoring approach. And when a new engineer joined and hit the wall our Drupal setup puts in front of everyone, I helped turn that friction into reusable onboarding documentation — the kind of small enablement work that saves the next person a week of spelunking.',
        ],
      },
    ],
    techTags: [
      'Drupal',
      'PHP',
      'JavaScript',
      'React',
      'Docker',
      'GitHub Actions',
      'Akamai',
      'AWS S3',
      'MySQL',
      'Cypress',
      'GA4',
      'New Relic',
      'Splunk',
    ],
    relatedLinks: [
      { label: 'tableau.com', href: 'https://www.tableau.com' },
      {
        label: 'Pricing Calculator',
        href: 'https://www.tableau.com/product-and-pricing-selector',
      },
    ],
  },
  {
    dateRange: 'Jul 2016 – Jan 2017',
    title: 'Software Engineer',
    company: 'Moz',
    companyHref: 'https://www.moz.com',
    description:
      'Migrated portions of moz.com from CakePHP to Craft CMS, partnered with the UX team turning design comps into marketing pages, and worked with business intelligence to implement page-load and event tracking through Adobe DTM and Segment — the start of the analytics-engineering thread that runs through everything since.',
    techTags: ['Craft CMS', 'PHP', 'JavaScript', 'Adobe DTM', 'Segment'],
    relatedLinks: [],
  },
  {
    dateRange: 'Oct 2014 – Oct 2021',
    title: 'Web Developer',
    company: 'Studio Ten Four',
    companyHref: 'https://www.studiotenfour.com',
    description:
      'Seven years building, inheriting and migrating WordPress and Drupal platforms for public-sector and university clients, owning the relationship end to end from requirements through delivery.',
    clusters: [
      {
        label: 'Running the engagement',
        synopsis:
          'I mentored the interns, owned the client relationship end to end, and handled the parts of a small agency nobody lists on a résumé — scoping, invoicing and client service included.',
        paragraphs: [
          'Seven years at a small agency means wearing every hat, and the engineering was only part of it. I mentored interns through their first real client work — code review, and the harder lesson that a deadline someone is paying for is different from a deadline in a classroom. I scoped and estimated engagements, handled invoicing, and was the person clients actually called when something broke.',
          'That is where I learned to translate between what a client asks for and what they need built — the same skill I use now taking requirements from marketing stakeholders who don’t think in tickets.',
        ],
      },
      {
        label: 'Client platforms',
        synopsis:
          'Inherited and migrated the University of Hawai’i law school platform, acted as contract developer and consultant for King County’s 4Culture across themes, CI/CD and infrastructure, and built the SSNOCWTA site from scratch to WCAG compliance.',
        paragraphs: [
          'For the University of Hawai’i’s William S. Richardson School of Law I inherited and maintained a Drupal platform — course database, personnel directory, events calendar, student classifieds, job listings, and a portal gated to @hawaii.edu accounts — then led the data migration when the site was rebuilt onto WordPress. For King County’s 4Culture I was effectively the contract web developer and consultant: theme and template development, the deployment pipeline and CI/CD, infrastructure and Docker-based local orchestration for the team, a Foundation-to-Bootstrap 5 migration that amounted to a rebuild, custom plugin work, and an accessibility and SEO overhaul under county compliance deadlines — screen-reader and keyboard-navigation testing alongside the design and content teams, plus custom Drupal hooks that automated meta-tag population and schema-markup injection. I built the South Seminole & North Orange County Wastewater Transmission Authority site from scratch to WCAG accessibility compliance.',
          'I also introduced automated build and test pipelines to client projects years before it became my specialty, and did enough schema export and transformation work that platform migration became a through-line rather than a one-off.',
        ],
      },
    ],
    techTags: ['WordPress', 'Drupal', 'PHP', 'MySQL', 'Accessibility'],
    relatedLinks: [
      { label: '4culture.org', href: 'https://www.4culture.org' },
      { label: 'law.hawaii.edu', href: 'https://law.hawaii.edu' },
      { label: 'ssnocwta.com', href: 'https://ssnocwta.com' },
    ],
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
    'As a marketer, I appreciated his communication style the most as well as his speediness. My job was to request new landing pages and updates to our marketing pages… I really appreciated that. I\'d recommend Laud… to any dev team who can work well with marketers.',
  author: 'Brittani Dinsmore',
  role: 'Marketing Leader, Moz',
};

interface ExperienceSectionProps {
  cvHref: string | null;
}

export default function ExperienceSection({ cvHref }: ExperienceSectionProps) {
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
          {cvHref && (
            <a
              href={cvHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-teal-700 transition-colors hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
            >
              View Full Résumé
              <ExternalLinkIcon />
            </a>
          )}
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
                <header className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:col-span-2">
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
                  {entry.subtitle && (
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{entry.subtitle}</p>
                  )}
                  <p className="mt-2 text-sm leading-normal text-slate-700 dark:text-slate-400">
                    {entry.description}
                  </p>

                  {entry.clusters && (
                    <div className="mt-5 space-y-5 border-l border-slate-200 pl-4 dark:border-slate-800">
                      {entry.clusters.map(cluster => (
                        <DisclosurePanel
                          key={cluster.label}
                          label={cluster.label}
                          synopsis={cluster.synopsis}
                        >
                          {cluster.paragraphs.map((paragraph, index) => (
                            <p
                              key={index}
                              className="text-sm leading-normal text-slate-700 dark:text-slate-400"
                            >
                              {paragraph}
                            </p>
                          ))}
                        </DisclosurePanel>
                      ))}
                    </div>
                  )}

                  {/* Labelled for the same reason as ProjectsSection's — these
                      describe the role's stack, not a claimed-skill list. */}
                  <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Stack
                  </p>
                  <ul className="mt-1 flex flex-wrap" aria-label="Role stack">
                    {entry.techTags.map(tag => (
                      <li key={tag} className="mr-1.5 mt-2">
                        {/* Neutral outline — see ProjectsSection for why these
                            must not look like the teal Skills pills. */}
                        <div className="flex items-center rounded-full border border-slate-300 px-3 py-1 text-xs font-medium leading-5 text-slate-600 dark:border-slate-700 dark:text-slate-400">
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
                <p className="text-sm font-medium text-teal-700 dark:text-teal-400">{entry.year}</p>
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

        {/*
          Testimonial. The label is the point (PRE-08, WEBSITE-BRIEF §5 #9): a
          marketing stakeholder praising an engineer's communication is
          third-party evidence of stakeholder fluency. Unlabelled it reads as
          decoration, which is what it was doing before.
        */}
        <figure className="mt-16 border-t border-slate-200 pt-10 dark:border-slate-800">
          {/* Not a <figcaption> — a <figure> may only have one, and the
              attribution below is it. */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Third-party evidence: working directly with non-engineering stakeholders
            </h3>
            <p className="mt-1 text-sm italic text-slate-600 dark:text-slate-400">
              Most of my work is requested by people who don&apos;t think in tickets. This is the
              one part of the job you can&apos;t credibly claim about yourself.
            </p>
          </div>
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
