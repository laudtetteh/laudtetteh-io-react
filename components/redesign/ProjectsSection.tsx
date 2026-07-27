import Image from 'next/image';
import MobileSectionTitle from './MobileSectionTitle';

/**
 * A single curated project card. Layout/markup (list with a small
 * thumbnail beside the text, hover-highlight overlay, teal tag pills,
 * arrow-icon title link) mirrors the reference site's actual rendered
 * structure — a list, not a card grid — ground-truthed against a saved
 * copy of its HTML.
 *
 * Content sourced from Laud's résumé (`public/docs/cv/Laud-Tetteh-Resume.pdf`).
 * Images are placeholder graphics (generated, not screenshots) pending
 * real screenshots from Laud.
 */
interface ProjectEntry {
  title: string;
  url: string;
  description: string;
  image: string;
  tags: string[];
}

const projects: ProjectEntry[] = [
  {
    title: 'MethodistCRM',
    url: 'https://laudtetteh.io/methodistcrm.html',
    description:
      'CRM dashboard with authentication for community-based church programs. Reports & dynamic search, notifications, analytics, messaging, an events calendar, branch locator, store, cart, and checkout.',
    image: '/images/projects/methodistcrm.png',
    tags: ['Laravel', 'MySQL', 'PHP'],
  },
  {
    title: 'King County 4Culture',
    url: 'https://www.4culture.org',
    description:
      'Webmaster and custom plugin development for this Washington State non-profit — ongoing WordPress development and support.',
    image: '/images/projects/culture4.png',
    tags: ['WordPress', 'PHP', 'Plugin Development'],
  },
  {
    title: 'UH Richardson School of Law',
    url: 'https://www.law.hawaii.edu',
    description:
      "Drupal-powered site for the University of Hawai'i's law school: class/course database, personnel directory, events calendar, student classifieds, job listings, and password-protected content for @hawaii.edu students. Also led the eventual Drupal-to-WordPress data migration.",
    image: '/images/projects/law-hawaii.png',
    tags: ['Drupal', 'WordPress', 'MySQL'],
  },
  {
    title: 'SSNOCWTA Accessibility Rebuild',
    url: 'https://ssnocwta.com',
    description:
      'Redesign and rebuild for South Seminole and North Orange County Wastewater Transmission Authority, focused on WCAG 2.2 accessibility compliance.',
    image: '/images/projects/ssnocwta.png',
    tags: ['WordPress', 'Accessibility', 'WCAG 2.2'],
  },
];

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      aria-label="Selected projects"
      className="mb-16 scroll-mt-16 bg-slate-50 dark:bg-slate-900 md:mb-24 lg:mb-36 lg:scroll-mt-24"
    >
      <MobileSectionTitle title="Projects" />
      <div className="mx-auto max-w-4xl px-6 sm:px-10 lg:px-16">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
          Projects
        </h2>

        <ul className="group/list mt-12">
          {projects.map(project => (
            <li key={project.image} className="mb-12">
              <div className="group relative grid gap-4 pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
                <div
                  aria-hidden="true"
                  className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-100 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(15,23,42,0.06)] lg:group-hover:drop-shadow-lg dark:lg:group-hover:bg-slate-800/50 dark:lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)]"
                />
                <div className="z-10 sm:order-2 sm:col-span-6">
                  <h3>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group/link inline-flex items-baseline text-base font-medium leading-tight text-slate-900 dark:text-slate-200"
                    >
                      <span className="inline-flex items-center">
                        {project.title}
                        <ExternalLinkIcon className="ml-1 h-4 w-4 shrink-0 translate-y-px transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 motion-reduce:transition-none" />
                      </span>
                    </a>
                  </h3>

                  <p className="mt-2 text-sm leading-normal text-slate-700 dark:text-slate-400">
                    {project.description}
                  </p>

                  <ul className="mt-2 flex flex-wrap" aria-label="Technologies used">
                    {project.tags.map(tag => (
                      <li key={tag} className="mr-1.5 mt-2">
                        <div className="flex items-center rounded-full bg-teal-600/10 px-3 py-1 text-xs font-medium leading-5 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300">
                          {tag}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative z-10 aspect-video w-full overflow-hidden rounded border-2 border-slate-200 transition sm:order-1 sm:col-span-2 sm:translate-y-1 dark:border-slate-200/10 group-hover:border-teal-600/40 dark:group-hover:border-slate-200/30">
                  <Image
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    fill
                    sizes="(min-width: 640px) 25vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ExternalLinkIcon({ className }: { className: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}
