import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';

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
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPosts(data);
        else console.error("❌ Unexpected blog response:", data);
      });

    const token = typeof window !== 'undefined' && localStorage.getItem('token');
    setLoggedIn(Boolean(token));
  }, []);

  const featured = posts.filter(p => p.status === "published" && p.featured === true);
  const regular = posts
    .filter(p => p.status === "published" && !p.featured)
    .sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0));

  return (
    <Layout title="Blog | Laud Tetteh" description="Read the latest posts from Laud Tetteh on software, tech, and more.">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Blog</h1>

        {featured.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">🌟 Featured</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {featured.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="block border rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-900 hover:shadow-md transition">
                  <div>
                    <img src={post.featuredImage} alt={post.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                      <p className="text-gray-500 text-sm mb-2">{post.date}</p>
                      <div className="mb-2">
                        {post.categories?.map(cat => (
                          <span key={cat} className="inline-block bg-gray-200 dark:bg-gray-700 text-xs px-2 py-1 rounded mr-2">{cat}</span>
                        ))}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{post.summary}</p>
                      {loggedIn && (
                        <div className="mt-4">
                          <Link href={`/admin/edit/${post.slug}`} className="text-blue-500 text-sm underline">Edit</Link>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4">All Posts</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {regular.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block border rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-900 hover:shadow-md transition">
              <div>
                <img src={post.featuredImage} alt={post.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                  <p className="text-gray-500 text-sm mb-2">{post.date}</p>
                  <div className="mb-2">
                    {post.categories?.map(cat => (
                      <span key={cat} className="inline-block bg-gray-200 dark:bg-gray-700 text-xs px-2 py-1 rounded mr-2">{cat}</span>
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{post.summary}</p>
                  {loggedIn && (
                    <div className="mt-4">
                      <Link href={`/admin/edit/${post.slug}`} className="text-blue-500 text-sm underline">Edit</Link>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default BlogIndex;
