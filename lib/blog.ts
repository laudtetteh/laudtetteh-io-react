import type { PostData } from '@/types/blog';

/**
 * `GET /api/posts` returns every post (draft and published), sorted
 * server-side by `date_published` desc (falling back to `date_created`,
 * then a legacy `date` field — see `backend/app/api/blog.py`). Server-side
 * callers (`getStaticProps`/ISR) must hit the internal Docker network
 * address via `API_SERVER`, not the browser-facing `NEXT_PUBLIC_API_BROWSER`
 * — see CLAUDE.md's "API routing" convention.
 */
const POSTS_ENDPOINT = `${process.env.API_SERVER}/api/posts`;

/**
 * Resolves a post's most relevant date for sorting, mirroring the backend's
 * own fallback chain (`date_published` -> `date_created`). `PostData` (see
 * `types/blog.ts`) doesn't model the backend's legacy `date` field, so an
 * unparsable/missing date sorts last rather than throwing.
 */
function toTimestamp(post: PostData): number {
  const raw = post.date_published || post.date_created || post.date_updated;
  if (!raw) return 0;
  const time = new Date(raw).getTime();
  return Number.isNaN(time) ? 0 : time;
}

/**
 * Fetches every published post, sorted by `date_published` descending.
 * Shared by `getLatestPosts` and `getAllPublishedPosts` so the fetch/filter/
 * sort logic lives in exactly one place.
 *
 * Server-side only (relies on `API_SERVER`, the Docker-internal address).
 * Matches `getSandboxRepos()`'s (`lib/github.ts`) error-handling contract:
 * throws on a non-OK response or network failure — callers are expected to
 * run this inside their own `getStaticProps` try/catch and fall back to an
 * empty array on failure, deciding their own revalidate behavior.
 */
async function fetchPublishedPosts(): Promise<PostData[]> {
  const res = await fetch(POSTS_ENDPOINT);
  if (!res.ok) {
    throw new Error(`Failed to fetch posts: ${res.status}`);
  }
  const allPosts: PostData[] = await res.json();
  return allPosts
    .filter(post => post.status === 'published')
    .sort((a, b) => toTimestamp(b) - toTimestamp(a));
}

/**
 * Fetches the latest `count` published posts — the real data source for the
 * redesign's Writing section (`docs/rebuild-spike--MASTER.md` §1 decision #10).
 */
export async function getLatestPosts(count: number): Promise<PostData[]> {
  const posts = await fetchPublishedPosts();
  return posts.slice(0, count);
}

/**
 * Fetches all published posts (no slice) — the data source for `/blog`'s
 * listing page, so its initial server-rendered HTML contains real post
 * content instead of relying on a client-only fetch (#16).
 */
export async function getAllPublishedPosts(): Promise<PostData[]> {
  return fetchPublishedPosts();
}
