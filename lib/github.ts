import type { GithubRepo } from '@/types/github';

const GITHUB_USERNAME = 'laudtetteh';

/**
 * Topics used to identify "Sandbox"-relevant repos (real, filterable code
 * samples shown on the homepage) versus the rest of the account's repos.
 */
const SANDBOX_TOPICS = new Set(['frontend', 'backend', 'devops', 'ci-cd']);

/** ISR revalidate window (seconds) for pages that call {@link getSandboxRepos}. */
export const SANDBOX_REVALIDATE_SECONDS = 21600; // 6 hours

/**
 * Fetches Laud's public GitHub repos and filters them down to the ones
 * tagged with a Sandbox-relevant topic (frontend/backend/devops/ci-cd).
 *
 * Single source of truth for this fetch — imported by both the current
 * homepage (`pages/index.tsx`) and the in-progress `/redesign` route, so it
 * must not be duplicated ad hoc in either place. Throws on a non-OK response;
 * callers are expected to run this inside their own `getStaticProps` try/catch
 * and fall back to an empty array on failure (each page decides its own
 * error-handling/revalidate behavior).
 */
export async function getSandboxRepos(): Promise<GithubRepo[]> {
  const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=100`);
  if (!res.ok) {
    throw new Error(`Failed to fetch repos: ${res.status}`);
  }
  const allRepos: GithubRepo[] = await res.json();
  return allRepos.filter(repo => repo.topics.some(topic => SANDBOX_TOPICS.has(topic)));
}
