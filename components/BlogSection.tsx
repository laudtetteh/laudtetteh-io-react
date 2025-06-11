import Link from 'next/link';
import { useEffect, useState } from 'react';

import { API_BASE_URL } from '@/utils/api';
import { getPosts } from '@/lib/api';
import type { PostData } from '@/types/blog';

interface BlogPostSummary
  extends Omit<
    PostData,
    'content' | 'categories' | 'status' | 'featured' | 'featuredImage' | 'weight'
  > {
  date?: string;
}

export default function BlogSection() {
  console.log('📡 API_BASE_URL = ', API_BASE_URL);
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);

  useEffect(() => {
    getPosts()
      .then((data) => setPosts(data))
      .catch((err) => {
        console.error('Failed to load blog posts:', err);
        setPosts([]);
      });
  }, []);

  return (
    <section className="space-y-6">
      <h2 className="text-center text-2xl font-semibold">My Tech Journey</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block rounded border p-4 hover:bg-gray-50"
          >
            <h3 className="text-xl font-semibold">{post.title}</h3>
            <p className="text-sm text-gray-500">{post.summary}</p>
            {post.date && <p className="mt-2 text-xs text-gray-400">{post.date}</p>}
          </Link>
        ))}
      </div>
    </section>
  );
}
