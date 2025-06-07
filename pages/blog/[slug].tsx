import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { API_BASE_URL } from '@/utils/api';
import { useEffect, useState } from 'react';

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

      <main className="max-w-3xl mx-auto px-4 py-16 space-y-6">
        {post.featuredImage && (
          <img
            src={post.featuredImage}
            alt={`Featured image for ${post.title}`}
            className="w-full h-64 object-cover rounded"
          />
        )}

        {post.status && (
          <p className="text-sm text-gray-500">Status: {post.status}</p>
        )}

        <h1 className="text-3xl font-bold">{post.title}</h1>

        {post.date && (
          <p className="text-sm text-gray-500">
            Published on {new Date(post.date).toLocaleDateString()}
          </p>
        )}

        {(post.categories ?? []).length > 0 && (
          <p className="text-sm text-gray-500">
            Categories: {(post.categories ?? []).join(", ")}
          </p>
        )}

        <article
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="pt-6 text-sm space-x-4">
          <a href={`/blog/${post.slug}`} className="text-blue-600 underline">🔗 View Post</a>
          {loggedIn && (
            <Link href={`/admin/edit/${post.slug}`} className="text-blue-600 underline">✏️ Edit</Link>
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
    console.error("[getStaticPaths] ❌ Failed to fetch posts:", err);
    return { paths: [], fallback: true };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;

  try {
    const res = await fetch(`${API_BASE_URL}/api/posts/${slug}`);
    if (!res.ok) throw new Error("Post not found");

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
