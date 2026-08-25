import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { API_BASE_URL } from '@/utils/api';
import { useEffect, useState } from 'react';
import BlogLayout from '@/components/redesign/blog/BlogLayout';

interface BlogPost {
  /** Typed as a union because the API has historically sent this as an array in edge cases. */
  title: string | string[];
  slug: string;
  content: { html: string };
  summary?: string;
  date?: string;
  date_published?: string;
  status?: string;
  categories?: string[];
  featuredImage?: string;
}

interface PostNav {
  slug: string;
  title: string;
}

interface PostPageProps {
  post: BlogPost;
  prevPost?: PostNav | null;
  nextPost?: PostNav | null;
}

function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n - 1) + '…' : str;
}

function formatDate(dateString?: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'America/Los_Angeles',
  });
}

export default function BlogPostPage({ post, prevPost, nextPost }: PostPageProps) {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' && localStorage.getItem('token');
    setLoggedIn(Boolean(token));
  }, []);

  if (router.isFallback) {
    const fallbackSlug = Array.isArray(router.query.slug) ? router.query.slug[0] : router.query.slug;

    return (
      <BlogLayout
        title="Loading… | Laud Tetteh"
        description="Loading a blog post from Laud Tetteh."
        path={`/blog/${fallbackSlug ?? ''}`}
      >
        <p className="text-slate-600 dark:text-slate-400">Loading post...</p>
      </BlogLayout>
    );
  }

  const imageUrl =
    post.featuredImage && post.featuredImage.trim() !== '' ? post.featuredImage : '/images/writing/headless.jpeg';
  const socialImageUrl = post.featuredImage && post.featuredImage.trim() !== '' ? post.featuredImage : undefined;
  const author = 'Laud Tetteh';
  const category = post.categories && post.categories.length > 0 ? post.categories[0] : 'Uncategorized';
  const displayDate = post.date_published || post.date;
  const formattedDate = formatDate(displayDate);
  const displayTitle = Array.isArray(post.title) ? post.title.join(' ') : post.title;

  return (
    <BlogLayout
      title={`${displayTitle} | Laud Tetteh`}
      description={post.summary ?? ''}
      path={`/blog/${post.slug}`}
      type="article"
      imagePath={socialImageUrl}
      imageAlt={socialImageUrl ? `${displayTitle} featured image` : undefined}
    >
      <article className="mb-16 md:mb-24">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ul className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <Link href="/" className="hover:text-teal-600 dark:hover:text-teal-400">
                Home
              </Link>
            </li>
            <li aria-hidden="true">&rsaquo;</li>
            <li>
              <Link href="/blog" className="hover:text-teal-600 dark:hover:text-teal-400">
                Blog
              </Link>
            </li>
            <li aria-hidden="true">&rsaquo;</li>
            <li>
              <Link
                href={`/blog?category=${encodeURIComponent(category)}`}
                className="font-medium text-slate-700 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400"
              >
                {category}
              </Link>
            </li>
            <li aria-hidden="true">&rsaquo;</li>
            <li className="max-w-[12rem] truncate text-slate-700 dark:text-slate-300" title={displayTitle}>
              {displayTitle}
            </li>
          </ul>
        </nav>

        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
          {/* eslint-disable-next-line @next/next/no-img-element -- external S3 URLs, no configured next/image remote domains */}
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          {formattedDate && (
            <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow dark:bg-slate-900 dark:text-slate-300">
              {formattedDate}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
          <span>
            By <span className="font-medium text-slate-900 dark:text-slate-100">{author}</span>
          </span>
          <span aria-hidden="true">&middot;</span>
          <span>
            In{' '}
            <Link
              href={`/blog?category=${encodeURIComponent(category)}`}
              className="font-medium text-teal-600 hover:underline dark:text-teal-400"
            >
              {category}
            </Link>
          </span>
        </div>

        <h1 className="mt-6 text-3xl font-semibold text-slate-900 dark:text-slate-100 sm:text-4xl">{displayTitle}</h1>

        {/*
          `styles/globals.css`'s unscoped `.prose { max-width: 100% !important }`
          utility always wins over a `max-w-*` class applied to that same
          `.prose` element (importance beats specificity regardless of
          layer/order) — every other `.prose` usage in this codebase works
          around it with `max-w-none` rather than fighting it. The width cap
          has to live on this wrapping div instead.
        */}
        <div className="mt-8 max-w-3xl">
          <div
            className="prose prose-slate dark:prose-invert prose-a:text-teal-600 dark:prose-a:text-teal-400"
            dangerouslySetInnerHTML={{ __html: post.content.html }}
          />
        </div>

        {loggedIn && (
          <div className="mt-8">
            <Link href={`/admin/edit/${post.slug}`} className="text-sm font-medium text-teal-600 underline-offset-2 hover:underline dark:text-teal-400">
              Edit
            </Link>
          </div>
        )}

        {(prevPost || nextPost) && (
          <div className="mt-12 grid gap-4 border-t border-slate-200 pt-8 dark:border-slate-800 sm:grid-cols-2">
            {prevPost ? (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="rounded-lg border border-slate-200 p-4 transition-colors hover:border-teal-600/40 dark:border-slate-800 dark:hover:border-teal-400/40"
              >
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-500">Previous</span>
                <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">{truncate(prevPost.title, 48)}</p>
              </Link>
            ) : (
              <span />
            )}
            {nextPost ? (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="rounded-lg border border-slate-200 p-4 text-right transition-colors hover:border-teal-600/40 dark:border-slate-800 dark:hover:border-teal-400/40"
              >
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-500">Next</span>
                <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">{truncate(nextPost.title, 48)}</p>
              </Link>
            ) : (
              <span />
            )}
          </div>
        )}
      </article>
    </BlogLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/posts`);
    const posts: BlogPost[] = await res.json();

    const paths = posts.map((post) => ({
      params: { slug: post.slug },
    }));

    return { paths, fallback: 'blocking' };
  } catch (err) {
    console.error("[getStaticPaths] ❌ Failed to fetch posts:", err);
    return { paths: [], fallback: 'blocking' };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;

  try {
    // Fetch all posts to determine prev/next
    const allRes = await fetch(`${API_BASE_URL}/api/posts`);
    if (!allRes.ok) throw new Error("Failed to fetch posts");
    const allPosts: BlogPost[] = await allRes.json();
    const index = allPosts.findIndex((p) => p.slug === slug);
    const prevPost = index > 0 ? allPosts[index - 1] : null;
    const nextPost = index < allPosts.length - 1 ? allPosts[index + 1] : null;

    // Fetch current post
    const res = await fetch(`${API_BASE_URL}/api/posts/${slug}`);
    if (res.status === 404) {
      return {
        notFound: true,
        revalidate: 10,
      };
    }
    if (!res.ok) throw new Error("Post not found");
    const post: BlogPost = await res.json();
    return {
      props: {
        post,
        prevPost: prevPost ? { slug: prevPost.slug, title: prevPost.title } : null,
        nextPost: nextPost ? { slug: nextPost.slug, title: nextPost.title } : null,
      },
      revalidate: 10,
    };
  } catch (err) {
    console.error(`[getStaticProps] ❌ Failed to fetch post for slug '${slug}':`, err);
    return {
      notFound: true,
      revalidate: 10,
    };
  }
};
