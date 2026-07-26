import Image from 'next/image';

/**
 * A single curated project card. Structurally mirrors the reference site's
 * "Projects" case-study format (title+link, description, tech tags,
 * screenshot) — content is bracketed placeholder until Laud has real
 * curated case studies to fill in (see docs/rebuild-spike--MASTER.md §2).
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
    title: '[Project title]',
    url: '#',
    description:
      '[Project description — a short summary of the problem, the approach, and the outcome.]',
    image: '/images/projects/halcyon.png',
    tags: ['[Tech tag]', '[Tech tag]', '[Tech tag]'],
  },
  {
    title: '[Project title]',
    url: '#',
    description:
      '[Project description — a short summary of the problem, the approach, and the outcome.]',
    image: '/images/projects/v4.png',
    tags: ['[Tech tag]', '[Tech tag]', '[Tech tag]'],
  },
  {
    title: '[Project title]',
    url: '#',
    description:
      '[Project description — a short summary of the problem, the approach, and the outcome.]',
    image: '/images/projects/spotify-profile.png',
    tags: ['[Tech tag]', '[Tech tag]', '[Tech tag]'],
  },
  {
    title: '[Project title]',
    url: '#',
    description:
      '[Project description — a short summary of the problem, the approach, and the outcome.]',
    image: '/images/projects/course-card.png',
    tags: ['[Tech tag]', '[Tech tag]', '[Tech tag]'],
  },
];

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      className="bg-slate-50 py-24 dark:bg-slate-900"
    >
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
          Projects
        </h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {projects.map(project => (
            <article
              key={project.image}
              className="group overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50"
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
