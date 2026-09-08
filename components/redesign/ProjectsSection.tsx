import MobileSectionTitle from './MobileSectionTitle';
import { ReadMore } from './DisclosurePanel';

/**
 * Projects. Content is governed by `$RIG_DIR/docs/career/WEBSITE-CONTENT-SPEC.md`
 * §D, which cites a dossier item ID for every claim.
 *
 * Two structural decisions worth not undoing:
 *
 * 1. **No thumbnails.** The previous version showed generated placeholder
 *    graphics rather than real screenshots, and there are no real ones for the
 *    four current lead projects. WEBSITE-BRIEF §2 is explicit that "four
 *    project write-ups with real substance beat twelve thumbnails — resist the
 *    portfolio-grid instinct", so this is a text-forward list by design, not an
 *    unfinished grid.
 * 2. **LaudBot → The Rig → Beacon Essentials render as one grouped arc**, not
 *    three sibling cards. DOSSIER §5.0.1: the sequence *is* the argument
 *    (build → wall → generalize → apply), and it is worthless told as three
 *    unrelated entries.
 *
 * Attribution note: Beacon Essentials uses "designed, built and maintain" and
 * is called "a production e-commerce platform", never "a business" and never
 * "run"/"operate" — DOSSIER §7.2 bans those specifically, because commercial
 * framing alongside a full-time role invites moonlighting/IP questions.
 */
interface ProjectEntry {
  title: string;
  url: string;
  /** Shown next to the link when the destination isn't openly accessible. */
  linkNote?: string;
  /**
   * Collapsed-state summary (#116). Present on the grouped cards only — the
   * featured Pricing Calculator stays open because it is the section's hook.
   *
   * For the three arc projects the synopsis deliberately carries the
   * *connective* phrase ("So I generalized the fix", "And then I used it"), not
   * just a description. The arc only reads as one story if the collapsed state
   * preserves the chain; summarising each project in isolation would quietly
   * destroy the narrative the grouping exists to tell.
   */
  synopsis?: string;
  paragraphs: string[];
  tags: string[];
}

/** A compressed, demoted entry for the pre-2021 agency era. */
interface SecondaryEntry {
  title: string;
  url: string;
  description: string;
}

/** The Pricing Calculator leads; access notes distinguish public and private work. */
const featuredProject: ProjectEntry = {
  title: 'Tableau Pricing Calculator',
  url: 'https://www.tableau.com/product-and-pricing-selector',
  paragraphs: [
    'The pricing selector on tableau.com — the tool that lets you configure product editions, licenses and add-ons and see what they cost. I extended the legacy version rather than replacing it, across its UI, its API design and its backend: multi-currency logic and cached exchange rates resolved server-side rather than in the browser, payload contracts negotiated with the frontend team, accessibility and responsive work, analytics instrumentation, and end-to-end Cypress coverage. It is public, so you can go and click it.',
  ],
  tags: ['React', 'Drupal', 'REST API', 'Cypress', 'GA4'],
};

/**
 * `LaudBot → The Rig → Beacon Essentials`, told as one story in that order.
 * Build → wall → generalize → apply. DOSSIER §5.0.1 is explicit that these
 * must never be presented as three unrelated cards — the sequence is the point.
 */
const arcProjects: ProjectEntry[] = [
  {
    title: 'LaudBot',
    synopsis:
      'A production, invite-only AI agent that answers questions about my background from approved sources only, never guessing — administered entirely in-app, down to swapping the LLM provider without a redeploy.',
    // The corpus refresh is merged; the app remains invite-only while #107
    // completes its live probe checklist.
    url: 'https://laudbot.laudtetteh.io',
    linkNote: 'invite only',
    paragraphs: [
      'A production, invite-only AI agent that gives approved visitors — recruiters, colleagues — a conversational way to ask about my background. It answers from approved sources only and doesn’t guess, adapts its tone and focus per invite, and is administered entirely in-app: content, modes and even the LLM provider are configurable without a redeploy. Every AI call routes through a provider-agnostic abstraction layer, so swapping providers doesn’t touch business logic. Two-role JWT auth keeps visitor and admin strictly separate. I wrote the product requirements and architecture documents before I wrote any code.',
      'It’s also what broke. Building it across dozens of sessions with AI coding agents, each session surfaced a new failure mode — agents forgetting decisions, drifting from the project’s conventions, leaving no audit trail of why anything was done.',
    ],
    tags: ['FastAPI', 'PostgreSQL', 'Next.js', 'JWT', 'Docker'],
  },
  {
    title: 'The Rig',
    synopsis:
      'So I generalized the fix. An open-source framework giving AI coding agents persistent structured memory, enforced workflows and a git-hook layer — MIT licensed, 300+ commits, piloted on a real production platform.',
    url: 'https://github.com/laudtetteh/the-rig',
    paragraphs: [
      'So I generalized the fix. The Rig is an open-source framework that gives AI coding agents persistent structured memory, enforced workflows, a task lifecycle engine, and a git-hook layer that won’t let a commit through without secret scanning and a properly formatted conventional message. Nine lifecycle hooks cover protected-path write restrictions, commit gating, context-compaction checkpointing and subagent context injection. MIT licensed, 300+ commits, with a bats test suite running in CI. I piloted it on 4Culture.org — a real multi-contributor production platform — rather than only on my own machine.',
    ],
    tags: ['Shell', 'Git hooks', 'CI', 'MIT'],
  },
  {
    title: 'Beacon Essentials',
    synopsis:
      'And then I used it. A production e-commerce platform in Ghana that I designed, built and maintain — and it runs on The Rig. WhatsApp deep-link ordering, Mobile Money, dispatch-rider tracking; 540+ commits over a year.',
    url: 'https://beaconessentials.shop',
    linkNote: 'private source repository · access on request',
    paragraphs: [
      'And then I used it. Beacon Essentials is a production e-commerce platform in Ghana that I designed, built and maintain — and it runs on The Rig. The interesting constraint was never technical: checkout had to work the way that market actually buys, which meant WhatsApp deep-link ordering with a conventional cart as fallback, Mobile Money as the primary payment rail, and order tracking built around dispatch-rider delivery. FastAPI and MongoDB on the back, Next.js on the front, a mobile workspace alongside them, all in one Turborepo monorepo; pre-signed S3 media so the API never serves binaries; Docker and GitHub Actions to deploy, with linting, tests and secret scanning enforced on every commit. 540+ commits and 450+ pull requests over a year.',
      'That last part is the real test of The Rig — it’s the framework running against software that takes money, not a framework with a README.',
    ],
    tags: ['FastAPI', 'MongoDB', 'Next.js', 'Turborepo', 'Docker', 'GitHub Actions', 'AWS S3'],
  },
];

/**
 * The counterweight (DOSSIER §5.0.1 Narrative B). Hand-coded and solo, pre-AI.
 * "Never present A without B available" — it answers the question the arc above
 * invites. ATTRIBUTION: BUILT, so strong verbs apply without qualification.
 */
const counterweightProject: ProjectEntry = {
  title: 'MethodistCRM',
    synopsis:
      'Built solo and by hand in 2019\u20132021, before AI coding assistance existed. Laravel and MySQL: 38 models, 62 controllers and 359 views over a diocese → circuit → branch hierarchy, with deployment automation I wrote myself.',
  url: '/blog/methodistcrm',
  paragraphs: [
    'Built solo and by hand in 2019–2021, before AI coding assistance existed. Laravel and MySQL: 38 Eloquent models, 62 controllers and 359 Blade views over a three-level organizational hierarchy of diocese → circuit → branch. Barcode-based attendance check-in, a messaging subsystem with threads and drafts, Algolia-backed search, SMS through Hubtel — a Ghanaian gateway — push notifications, bulk Excel and CSV import/export through a staging table, and a full store with cart and checkout. I wrote its deployment automation by hand too: a shell script doing a git clone and an atomic directory swap while preserving uploads across releases, with companion database backup crons. Years before I had CI/CD tooling to do it for me.',
    'Choosing Hubtel in 2019 and Mobile Money in 2025 is the same instinct six years apart — build for how that market actually transacts, not how the textbook says.',
    'Every architectural decision in it is one I made and still live with. It’s here to answer the question every engineer is quietly being asked in 2026: is the person good, or is the tooling good?',
  ],
  tags: ['Laravel', 'PHP', 'MySQL', 'Algolia', 'Shell'],
};

/**
 * `BA-02` / `OSS-04`. **Attribution matters here:** the Laravel + Vue application
 * is not his — he modernized and containerized someone else's legacy codebase.
 * Every verb below is deliberately about the infrastructure work, never the app.
 */
const containerizationProject: ProjectEntry = {
  title: 'Seattle Collisions',
  url: 'https://seattlecollisions.timganter.io/collisions',
  synopsis:
    'A legacy Laravel + Vue collision-data explorer that I containerized and modernized — I did not write the application, I made it deployable.',
  paragraphs: [
    'Docker Compose orchestrating the Laravel API, the Vue frontend and MySQL over an internal bridge network, with cross-service networking and environment configuration; GitHub Actions building the images; nginx on the host handling SSL termination with Certbot auto-renewal; and the local workflow documented so the next contributor can bring the whole stack up with one command.',
    'It is the least glamorous kind of work and the kind most often needed: an application that ran on one person’s machine now runs reproducibly for anyone.',
  ],
  tags: ['Laravel', 'Vue', 'MySQL', 'Docker Compose', 'GitHub Actions', 'nginx'],
};

/** Retained but demoted — DOSSIER §7: "compressed, not deleted." */
const secondaryProjects: SecondaryEntry[] = [
  {
    title: 'King County 4Culture',
    url: 'https://www.4culture.org',
    description:
      'Contract web developer and consultant for a Washington State public arts agency — theme and template development, the deployment pipeline and CI/CD, infrastructure and Docker-based local orchestration, and a Foundation-to-Bootstrap 5 migration that amounted to a rebuild.',
  },
  {
    title: 'UH Richardson School of Law',
    url: 'https://law.hawaii.edu',
    description:
      'Inherited and maintained the Drupal platform, then led its data migration onto WordPress.',
  },
  {
    title: 'SSNOCWTA',
    url: 'https://ssnocwta.com',
    description: 'Built from scratch to WCAG accessibility compliance.',
  },
];

/** Renders one full-depth project entry: title link, prose, tag pills. */
function ProjectCard({
  project,
  headingLevel = 3,
}: {
  project: ProjectEntry;
  /** 4 when the card sits inside a labelled group, so the group label stays its
      parent in the accessibility outline rather than its sibling. */
  headingLevel?: 3 | 4;
}) {
  const isExternal = project.url.startsWith('http');
  const Heading = headingLevel === 4 ? 'h4' : 'h3';

  return (
    <li className="group rounded-md border border-slate-200 bg-white/80 p-5 shadow-sm shadow-slate-200/40 transition-colors lg:hover:!opacity-100 lg:group-hover/list:opacity-50 dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-black/10">
      <Heading className="flex flex-wrap items-baseline gap-x-2">
        {project.url ? (
          <a
            href={project.url}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noreferrer noopener' : undefined}
            className="group/link inline-flex items-baseline text-base font-medium leading-tight text-slate-900 dark:text-slate-200"
          >
            <span className="inline-flex items-center">
              {project.title}
              {/* Only on genuinely external destinations — the icon means
                  "leaves this site", and /blog/methodistcrm does not. */}
              {isExternal && (
                <ExternalLinkIcon className="ml-1 h-4 w-4 shrink-0 translate-y-px transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 motion-reduce:transition-none" />
              )}
            </span>
          </a>
        ) : (
          <span className="text-base font-medium leading-tight text-slate-900 dark:text-slate-200">
            {project.title}
          </span>
        )}
        {project.linkNote && (
          <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
            ({project.linkNote})
          </span>
        )}
      </Heading>

      {project.synopsis ? (
        <ReadMore synopsis={project.synopsis} title={project.title}>
          {project.paragraphs.map((paragraph, index) => (
            <p key={index} className="text-sm leading-normal text-slate-700 dark:text-slate-400">
              {paragraph}
            </p>
          ))}
        </ReadMore>
      ) : (
        <div className="mt-2 space-y-2">
          {project.paragraphs.map((paragraph, index) => (
            <p key={index} className="text-sm leading-normal text-slate-700 dark:text-slate-400">
              {paragraph}
            </p>
          ))}
        </div>
      )}

      {/*
        The visible "Stack" label matters, it isn't decoration. These pills are
        styled identically to the Skills pills in AboutSection, and DOSSIER
        §10.4 draws a hard line between a tool appearing in a system (accurate,
        permitted) and a skill being claimed (not). Without the label a reader
        cannot tell which of the two they are looking at.
      */}
      <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        Stack
      </p>
      <ul className="mt-1 flex flex-wrap" aria-label="Project stack">
        {project.tags.map(tag => (
          <li key={tag} className="mr-1.5 mt-2">
            {/*
              Neutral outline, deliberately NOT the teal fill used by the Skills
              pills in AboutSection. Identical styling let a skimming reader read
              a project's stack as a claimed skill — the distinction DOSSIER
              §10.4 turns on, since several of these (FastAPI, MongoDB, Next.js)
              are accurate as system composition but explicitly not claimable.
            */}
            <div className="flex items-center rounded-full border border-slate-300 px-3 py-1 text-xs font-medium leading-5 text-slate-600 dark:border-slate-700 dark:text-slate-400">
              {tag}
            </div>
          </li>
        ))}
      </ul>
    </li>
  );
}

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

        <ul className="group/list mt-10 space-y-5">
          <ProjectCard project={featuredProject} />
        </ul>

        {/* The arc. The intro line is what makes these three read as one story. */}
        <div className="mt-14">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-teal-700 dark:text-teal-400">
            I built a thing, hit a wall, then turned the wall into tooling
          </h3>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-400">
            These three are one story, in order. The wall is the interesting part — everything I
            build now runs on what came out of it, including the work I do at my day job.
          </p>
          <ul className="group/list mt-6 space-y-5 border-l border-slate-200 pl-4 dark:border-slate-800">
            {arcProjects.map(project => (
              <ProjectCard key={project.title} project={project} headingLevel={4} />
            ))}
          </ul>
        </div>

        <div className="mt-14">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-teal-700 dark:text-teal-400">
            The counterweight
          </h3>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-400">
            Every engineer is quietly being asked the same question in 2026: is the person good,
            or is the tooling good? Here is 2019, when there was no tooling.
          </p>
          <ul className="group/list mt-6 space-y-5">
            <ProjectCard project={counterweightProject} headingLevel={4} />
          </ul>
        </div>

        <div className="mt-14">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-teal-700 dark:text-teal-400">
            Modernizing someone else&rsquo;s codebase
          </h3>
          <ul className="group/list mt-6 space-y-5">
            <ProjectCard project={containerizationProject} headingLevel={4} />
          </ul>
        </div>

        {/* Retained but demoted — DOSSIER §7: "compressed, not deleted." */}
        <div className="mt-14 border-t border-slate-200 pt-8 dark:border-slate-800">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-400">
            Earlier client work &middot; 2014&ndash;2021
          </h3>
          <ul className="mt-4 space-y-3">
            {secondaryProjects.map(project => (
              <li key={project.title} className="text-sm leading-normal">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-medium text-slate-900 underline-offset-4 hover:underline dark:text-slate-200"
                >
                  {project.title}
                </a>
                <span className="text-slate-700 dark:text-slate-400"> &mdash; {project.description}</span>
              </li>
            ))}
          </ul>
        </div>
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
