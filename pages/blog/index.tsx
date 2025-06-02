import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type BlogPost = {
  title: string;
  summary: string;
  date: string;
  featuredImage: string;
  categories: string[];
  slug: string;
};

const BlogIndex: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetch('/api/blog')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <div className="grid gap-8 md:grid-cols-2">
        {posts.map(post => (
          <div key={post.slug} className="border rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-900">
            <img src={post.featuredImage} alt={post.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-gray-500 text-sm mb-2">{post.date}</p>
              <div className="mb-2">
                {post.categories.map(cat => (
                  <span key={cat} className="inline-block bg-gray-200 dark:bg-gray-700 text-xs px-2 py-1 rounded mr-2">{cat}</span>
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300">{post.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogIndex; 