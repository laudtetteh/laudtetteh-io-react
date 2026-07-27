import Image from 'next/image';
import MobileSectionTitle from './MobileSectionTitle';

/**
 * A single curated project card. Content sourced from Laud's résumé
 * (`public/docs/cv/Laud-Tetteh-Resume.pdf`) — real clients/case studies,
 * not fabricated. Images are placeholder graphics (generated, not
 * screenshots) pending real screenshots from Laud.
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
      className="mb-16 scroll-mt-16 bg-slate-50 dark:bg-slate-900 md:mb-24 lg:mb-36 lg:scroll-mt-24"
    >
      <MobileSectionTitle title="Projects" />
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
          Projects
        </h2>

        <div className="group/list mt-12 grid gap-8 sm:grid-cols-2">
          {projects.map(project => (
            <article
              key={project.image}
              className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition-opacity motion-reduce:transition-none dark:border-slate-800 dark:bg-slate-900/50 lg:hover:!opacity-100 lg:group-hover/list:opacity-50"
            >
              <div className="relative aspect-video w-full overflow-hidden border-b border-slate-200 dark:border-slate-800">
                <Image
                  src={project.image}
                  alt={`${project.title} screenshot`}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-teal-600 dark:hover:text-teal-400"
                  >
                    {project.title}
                  </a>
                </h3>

                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {project.description}
                </p>

                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <li
                      key={`${project.image}-tag-${index}`}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
