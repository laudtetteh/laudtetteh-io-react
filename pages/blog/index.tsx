import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type BlogPost = {
  title: string;
  summary: string;
  date: string;
  featuredImage: string;
  categories: string[];
  slug: string;
  status: string;
  featured?: boolean;
  weight?: number;
};

const BlogIndex: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/posts`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPosts(data);
        else console.error('❌ Unexpected blog response:', data);
      });

    const token = typeof window !== 'undefined' && localStorage.getItem('token');
    setLoggedIn(Boolean(token));
  }, []);

  const featured = posts.filter((p) => p.status === 'published' && p.featured === true);
  const regular = posts
    .filter((p) => p.status === 'published' && !p.featured)
    .sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0));

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Blog</h1>

      {featured.length > 0 && (
        <div className="mb-12">
          <h2 className="mb-4 text-2xl font-bold">🌟 Featured</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {featured.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md dark:bg-gray-900"
              >
                <div>
                  <Image
                    src={
                      post.featuredImage && post.featuredImage.trim()
                        ? post.featuredImage
                        : '/fallback.png'
                    }
                    alt={post.title}
                    width={500}
                    height={200}
                    className="h-32 w-full object-cover"
                  />
                  <div className="p-4">
                    <h2 className="mb-2 text-xl font-semibold">{post.title}</h2>
                    <p className="mb-2 text-sm text-gray-500">{post.date}</p>
                    <div className="mb-2">
                      {post.categories?.map((cat) => (
                        <span
                          key={cat}
                          className="mr-2 inline-block rounded bg-gray-200 px-2 py-1 text-xs dark:bg-gray-700"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{post.summary}</p>
                    {loggedIn && (
                      <div className="mt-4">
                        <Link
                          href={`/admin/edit/${post.slug}`}
                          className="text-sm text-blue-500 underline"
                        >
                          Edit
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <h2 className="mb-4 text-2xl font-bold">All Posts</h2>
      <div className="grid gap-8 md:grid-cols-2">
        {regular.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md dark:bg-gray-900"
          >
            <div>
              <Image
                src={
                  post.featuredImage && post.featuredImage.trim()
                    ? post.featuredImage
                    : '/fallback.png'
                }
                alt={post.title}
                width={500}
                height={200}
                className="h-32 w-full object-cover"
              />
              <div className="p-4">
                <h2 className="mb-2 text-xl font-semibold">{post.title}</h2>
                <p className="mb-2 text-sm text-gray-500">{post.date}</p>
                <div className="mb-2">
                  {post.categories?.map((cat) => (
                    <span
                      key={cat}
                      className="mr-2 inline-block rounded bg-gray-200 px-2 py-1 text-xs dark:bg-gray-700"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300">{post.summary}</p>
                {loggedIn && (
                  <div className="mt-4">
                    <Link
                      href={`/admin/edit/${post.slug}`}
                      className="text-sm text-blue-500 underline"
                    >
                      Edit
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogIndex;
