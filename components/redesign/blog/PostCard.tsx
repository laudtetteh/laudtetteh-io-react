import Link from 'next/link';
import type { PostData } from '@/types/blog';

interface PostCardProps {
  post: PostData;
  loggedIn: boolean;
}

const FALLBACK_IMAGE = '/img/news/1.jpg';

/** Matches `WritingSection.tsx`'s date formatting so the archive reads consistently with the homepage teaser. */
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
 * Archive list card for `/blog`. A standalone implementation (not extracted
 * from `WritingSection.tsx`, which is out of scope for #60) but following
 * the same visual conventions, plus the admin-only Edit link this ticket
 * requires that the homepage teaser doesn't need.
 */
export default function PostCard({ post, loggedIn }: PostCardProps) {
  const category = post.categories?.[0] || 'Uncategorized';
  const displayDate = formatDate(post.date_published || post.date_created || post.date);
  const imageUrl = post.featuredImage && post.featuredImage.trim() !== '' ? post.featuredImage : FALLBACK_IMAGE;

  return (
    <article className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition-colors hover:border-teal-600/40 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-teal-400/40">
      <Link href={`/blog/${post.slug}`} className="block sm:flex">
        <div className="relative aspect-video w-full overflow-hidden border-b border-slate-200 dark:border-slate-800 sm:aspect-square sm:w-48 sm:shrink-0 sm:border-b-0 sm:border-r">
          {/* eslint-disable-next-line @next/next/no-img-element -- external S3 URLs, no configured next/image remote domains */}
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="p-6">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
            <span className="rounded-full border border-slate-200 px-3 py-1 dark:border-slate-800">{category}</span>
            {displayDate && <span>{displayDate}</span>}
          </div>

          <h3 className="mt-3 text-lg font-semibold text-slate-900 transition-colors group-hover:text-teal-600 dark:text-slate-100 dark:group-hover:text-teal-400">
            {post.title}
          </h3>

          <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">{post.summary}</p>

          <span className="mt-4 inline-block text-sm font-medium text-teal-600 underline-offset-2 group-hover:underline dark:text-teal-400">
            Read more &rarr;
          </span>
        </div>
      </Link>

      {loggedIn && (
        <div className="border-t border-slate-200 px-6 py-3 dark:border-slate-800">
          <Link
            href={`/admin/edit/${post.slug}`}
            className="text-sm font-medium text-teal-600 underline-offset-2 hover:underline dark:text-teal-400"
          >
            Edit
          </Link>
        </div>
      )}
    </article>
  );
}
