import Link from 'next/link';
import type { PostData } from '@/types/blog';
import MobileSectionTitle from './MobileSectionTitle';

interface WritingSectionProps {
  posts: PostData[];
}

/** Matches the blog archive date format so teasers read consistently across the site. */
function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

/**
 * "Writing" — the real blog feed teaser (decision #10,
 * `docs/rebuild-spike--MASTER.md` §1). Pure presentational component:
 * `posts` are fetched server-side via `getLatestPosts()` (`lib/blog.ts`)
 * inside `pages/redesign.tsx`'s `getStaticProps` and passed down as a prop,
 * so the cards are genuinely present in the initial SSR/SSG HTML — this is
 * what satisfies the redesign's SSR requirement for this section.
 *
 * Featured images use a plain `<img>`, matching the existing convention in
 * `BlogSection.tsx` / `pages/blog/index.tsx` / `pages/blog/[slug].tsx` —
 * `next/image` isn't used here because `next.config.ts` has no configured
 * remote image domains for the S3-hosted `featuredImage` URLs.
 */
export default function WritingSection({ posts }: WritingSectionProps) {
  const hasPosts = posts.length > 0;

  return (
    <section
      id="writing"
      className="mb-16 scroll-mt-16 bg-slate-50 dark:bg-slate-900 md:mb-24 lg:mb-36 lg:scroll-mt-24"
    >
      <MobileSectionTitle title="Writing" />
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Writing</h2>
            {/*
              Deliberately does not imply a cadence. Two posts remain after the
              #82 content cleanup, and "Recent posts on…" read as an active blog
              that no longer exists (#105).
            */}
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
              Occasional notes on the systems I work on.
            </p>
          </div>
          <Link
            href="/blog"
            className="shrink-0 text-sm font-medium text-teal-700 underline-offset-2 hover:underline dark:text-teal-400"
          >
            Read the blog &rarr;
          </Link>
        </div>

        {hasPosts ? (
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {posts.map(post => {
              const category = post.categories?.[0] || 'Uncategorized';
              const displayDate = formatDate(post.date_published || post.date_created);
              const imageUrl = post.featuredImage && post.featuredImage.trim() !== '' ? post.featuredImage : undefined;

              return (
                <article
                  key={post.slug}
                  className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition-colors hover:border-teal-600/40 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-teal-400/40"
                >
                  {imageUrl && (
                    <Link href={`/blog/${post.slug}`} className="block">
                      <div className="relative aspect-video w-full overflow-hidden border-b border-slate-200 dark:border-slate-800">
                        {/* eslint-disable-next-line @next/next/no-img-element -- external S3 URLs, no configured next/image remote domains (see file doc comment) */}
                        <img
                          src={imageUrl}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </Link>
                  )}

                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                      <span className="rounded-full border border-slate-200 px-3 py-1 dark:border-slate-800">
                        {category}
                      </span>
                      {displayDate && <span>{displayDate}</span>}
                    </div>

                    <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="transition-colors hover:text-teal-700 dark:hover:text-teal-400"
                      >
                        {post.title}
                      </Link>
                    </h3>

                    <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">{post.summary}</p>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-4 inline-block text-sm font-medium text-teal-700 underline-offset-2 hover:underline dark:text-teal-400"
                    >
                      Read more &rarr;
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 rounded-md border border-dashed border-slate-200 bg-white/60 px-6 py-10 text-center dark:border-slate-800 dark:bg-slate-900/40">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Nothing published here yet.</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400">
              The archive is still available.
            </p>
            <Link
              href="/blog"
              className="mt-5 inline-flex items-center justify-center rounded-md border border-teal-600 px-4 py-2 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-700 hover:text-white dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-400 dark:hover:text-slate-900"
            >
              Open the blog
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
