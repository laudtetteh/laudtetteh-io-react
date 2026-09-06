import type { PostData } from '@/types/blog';
import { STATIC_BLOG_POSTS } from '@/data/blogPosts';

/**
 * `GET /api/posts` returns published posts only, sorted server-side by
 * `date_published` desc (falling back to `date_created`, then a legacy
 * `date` field — see `backend/app/api/blog.py`). Server-side
 * callers (`getStaticProps`/ISR) must hit the internal Docker network
 * address via `API_SERVER`, not the browser-facing `NEXT_PUBLIC_API_BROWSER`
 * — see CLAUDE.md's "API routing" convention.
 */
function getPostsEndpoint(): string | null {
  return process.env.API_SERVER ? `${process.env.API_SERVER}/api/posts` : null;
}

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
 * Static posts are repo-backed content for PR review and production deploys.
 * API posts still merge in when the backend is reachable; static posts win on
 * slug conflicts so a reviewed post cannot be shadowed by stale database data.
 */
export function mergePublishedPosts(apiPosts: PostData[]): PostData[] {
  const seen = new Set<string>();
  return [...STATIC_BLOG_POSTS, ...apiPosts]
    .filter(post => post.status === 'published')
    .filter(post => {
      if (seen.has(post.slug)) return false;
      seen.add(post.slug);
      return true;
    })
    .sort((a, b) => toTimestamp(b) - toTimestamp(a));
}

async function fetchApiPublishedPosts(): Promise<PostData[]> {
  const endpoint = getPostsEndpoint();
  if (!endpoint) return [];

  const res = await fetch(endpoint);
  if (!res.ok) {
    throw new Error(`Failed to fetch posts: ${res.status}`);
  }
  return res.json();
}

async function fetchPublishedPosts(): Promise<PostData[]> {
  try {
    return mergePublishedPosts(await fetchApiPublishedPosts());
  } catch (error) {
    console.error(error);
    return mergePublishedPosts([]);
  }
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
