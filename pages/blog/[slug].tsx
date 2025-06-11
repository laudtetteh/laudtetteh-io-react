import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';

import { API_BASE_URL } from '@/utils/api';

interface BlogPost {
  title: string;
  slug: string;
  content: string;
  summary?: string;
  date?: string;
  status?: string;
  categories?: string[];
  featuredImage?: string;
}

interface PostPageProps {
  post: BlogPost;
}

function hasHtmlField(content: unknown): content is { html: string } {
  return (
    typeof content === 'object' &&
    content !== null &&
    'html' in content &&
    typeof (content as { html: unknown }).html === 'string'
  );
}

export default function BlogPostPage({ post }: PostPageProps) {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' && localStorage.getItem('token');
    setLoggedIn(Boolean(token));
  }, []);

  if (router.isFallback) {
    return <p className="p-6 text-center">Loading post...</p>;
  }

  return (
    <>
      <Head>
        <title>{post.title} | Laud Tetteh</title>
        <meta name="description" content={post.summary ?? ''} />
      </Head>

      <main className="featured-image-1 mx-auto max-w-3xl space-y-6 px-4 py-16">
        <Image
          src={
            post.featuredImage && post.featuredImage.trim() ? post.featuredImage : '/fallback.png'
          }
          alt={`Featured for ${post.title}`}
          width={500}
          height={200}
          className="h-64 w-full rounded object-cover"
        />

        {post.status && <p className="text-sm text-gray-500">Status: {post.status}</p>}

        <h1 className="text-3xl font-bold">{post.title}</h1>

        {post.date && (
          <p className="text-sm text-gray-500">
            Published on {new Date(post.date).toLocaleDateString()}
          </p>
        )}

        {(post.categories ?? []).length > 0 && (
          <p className="text-sm text-gray-500">Categories: {(post.categories ?? []).join(', ')}</p>
        )}

        <article
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{
            __html: hasHtmlField(post.content) ? post.content.html : post.content,
          }}
        />

        <div className="space-x-4 pt-6 text-sm">
          <a href={`/blog/${post.slug}`} className="text-blue-600 underline">
            🔗 View Post
          </a>
          {loggedIn && (
            <Link href={`/admin/edit/${post.slug}`} className="text-blue-600 underline">
              ✏️ Edit
            </Link>
          )}
        </div>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/posts`);
    const posts: BlogPost[] = await res.json();

    const paths = posts.map((post) => ({
      params: { slug: post.slug },
    }));

    return { paths, fallback: true };
  } catch (err) {
    console.error('[getStaticPaths] ❌ Failed to fetch posts:', err);
    return { paths: [], fallback: true };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;

  try {
    const res = await fetch(`${API_BASE_URL}/api/posts/${slug}`);
    if (!res.ok) throw new Error('Post not found');

    const post: BlogPost = await res.json();
    return { props: { post }, revalidate: 10 };
  } catch (err) {
    console.error(`[getStaticProps] ❌ Failed to fetch post for slug '${slug}':`, err);
    return {
      props: {
        post: {
          title: 'Post not found',
          slug,
          content: '<p>This post could not be loaded.</p>',
        },
      },
    };
  }
};
