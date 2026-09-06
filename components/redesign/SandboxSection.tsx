import React, { useMemo, useState } from 'react';
import type { GithubRepo } from '@/types/github';
import MobileSectionTitle from './MobileSectionTitle';

interface SandboxSectionProps {
  repos: GithubRepo[];
}

type SandboxCategory = 'all' | 'frontend' | 'backend' | 'devops' | 'ci-cd';

const CATEGORY_FILTERS: { id: SandboxCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'backend', label: 'Backend' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'devops', label: 'DevOps' },
  { id: 'ci-cd', label: 'CI/CD' },
];

const TOPIC_LABELS: Record<string, string> = {
  api: 'API',
  backend: 'Backend',
  'ci-cd': 'CI/CD',
  devops: 'DevOps',
  frontend: 'Frontend',
  html: 'HTML',
  javascript: 'JavaScript',
  mongodb: 'MongoDB',
  php: 'PHP',
  scss: 'SCSS',
  'shell-scripting': 'Shell',
  typescript: 'TypeScript',
};

const TITLE_LABELS: Record<string, string> = {
  '4culture': '4Culture',
  api: 'API',
  backend: 'Backend',
  ci: 'CI',
  cd: 'CD',
  crm: 'CRM',
  frontend: 'Frontend',
  methodistcrm: 'MethodistCRM',
  paystack: 'Paystack',
  wfhu: 'WFHU',
  w9: 'W9',
  wp: 'WP',
};

/** Turns a repo slug like `4culture-wp-glossary-pagination` into a readable title. */
function formatRepoName(name: string): string {
  return name
    .split(/[-_]/g)
    .map(part => TITLE_LABELS[part.toLowerCase()] || part.replace(/\b\w/g, char => char.toUpperCase()))
    .join(' ');
}

function formatTopic(topic: string): string {
  return TOPIC_LABELS[topic] || topic.replace(/[-_]/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

function getPrimaryTopic(repo: GithubRepo): string {
  const topic = CATEGORY_FILTERS.find(filter => filter.id !== 'all' && repo.topics.includes(filter.id))?.id;
  return topic ? formatTopic(topic) : repo.language || 'Repo';
}

function formatUpdatedDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function ExternalLinkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
      />
    </svg>
  );
}

/**
 * "Sandbox" — the real, live GitHub repo showcase (re-skinned for the
 * `/redesign` route). Kept as its own section, separate from Projects: the
 * two have different data shapes (curated case studies with screenshots vs.
 * real repo cards with none) — see docs/rebuild-spike--MASTER.md §1 decision #2.
 *
 * Pure presentational component — `repos` is fetched server-side via
 * `getSandboxRepos()` (`lib/github.ts`) and passed down as a prop. This
 * component only owns the client-side category filter state.
 */
const SandboxSection: React.FC<SandboxSectionProps> = ({ repos }) => {
  const [activeCategory, setActiveCategory] = useState<SandboxCategory>('all');
  const hasRepos = repos.length > 0;

  const filteredRepos = useMemo(() => {
    if (activeCategory === 'all') return repos;
    return repos.filter(repo => repo.topics.includes(activeCategory));
  }, [repos, activeCategory]);

  return (
    <section
      id="sandbox"
      className="mb-16 scroll-mt-16 bg-slate-50 transition-colors dark:bg-slate-900 md:mb-24 lg:mb-36 lg:scroll-mt-24"
    >
      <MobileSectionTitle title="Sandbox" />
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Sandbox</h2>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
              Public repos from GitHub, grouped by the kind of problem they solve.
            </p>
          </div>
          {hasRepos && (
            <p className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:border-slate-800 dark:text-slate-400">
              {repos.length} repos
            </p>
          )}
        </div>

        {hasRepos ? (
          <>
            <div className="mt-8 flex flex-wrap gap-2">
              {CATEGORY_FILTERS.map(filter => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveCategory(filter.id)}
                  aria-pressed={activeCategory === filter.id}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300 ease-out motion-reduce:transition-none active:scale-95 ${
                    activeCategory === filter.id
                      ? 'border-teal-600 bg-teal-700 text-white dark:border-teal-400 dark:bg-teal-400 dark:text-slate-900'
                      : 'border-slate-200 text-slate-600 hover:border-teal-600/40 hover:text-teal-700 dark:border-slate-800 dark:text-slate-400 dark:hover:border-teal-400/40 dark:hover:text-teal-400'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {filteredRepos.length > 0 ? (
              <div key={activeCategory} className="mt-8 grid animate-fade-in gap-4 motion-reduce:animate-none sm:grid-cols-2">
                {filteredRepos.map(repo => (
                  <article
                    key={repo.id}
                    className="group flex min-h-56 flex-col rounded-md border border-slate-200 bg-white/80 p-5 shadow-sm shadow-slate-200/40 transition-colors hover:border-teal-600/40 dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-black/10 dark:hover:border-teal-400/40"
                  >
                    <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      <span>{getPrimaryTopic(repo)}</span>
                      <span>{repo.language || formatUpdatedDate(repo.updated_at)}</span>
                    </div>

                    <div className="mt-4 flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold leading-snug text-slate-900 dark:text-slate-100">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors hover:text-teal-700 dark:hover:text-teal-400"
                        >
                          {formatRepoName(repo.name)}
                        </a>
                      </h3>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${formatRepoName(repo.name)} on GitHub`}
                        className="shrink-0 text-slate-500 transition-colors hover:text-teal-700 dark:text-slate-400 dark:hover:text-teal-400"
                      >
                        <ExternalLinkIcon />
                      </a>
                    </div>

                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {repo.description || 'No description available.'}
                    </p>

                    <ul className="mt-5 flex flex-wrap gap-2">
                      {repo.topics.slice(0, 3).map(topic => (
                        <li
                          key={topic}
                          className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium leading-5 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {formatTopic(topic)}
                        </li>
                      ))}
                      {repo.topics.length > 3 && (
                        <li className="rounded-full bg-teal-600/10 px-2.5 py-1 text-xs font-medium leading-5 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300">
                          +{repo.topics.length - 3}
                        </li>
                      )}
                    </ul>
                  </article>
                ))}
              </div>
            ) : (
              <p key={activeCategory} className="mt-10 animate-fade-in text-center text-sm text-slate-600 motion-reduce:animate-none dark:text-slate-400">
                No repos in this category right now.
              </p>
            )}
          </>
        ) : (
          <p className="mt-10 rounded-lg border border-dashed border-slate-200 px-6 py-10 text-center text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
            GitHub repos couldn&apos;t be loaded right now. Check back later, or visit{' '}
            <a
              href="https://github.com/laudtetteh"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-teal-700 underline underline-offset-2 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
            >
              github.com/laudtetteh
            </a>{' '}
            directly.
          </p>
        )}
      </div>
    </section>
  );
};

export default SandboxSection;
