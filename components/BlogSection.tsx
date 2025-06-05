import Link from 'next/link';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../utils/api';

interface BlogPostSummary {
  title: string;
  slug: string;
  summary: string;
  date: string;
}

export default function BlogSection() {
  console.log("📡 API_BASE_URL = ", API_BASE_URL);
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/posts`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => {
        console.error('Failed to load blog posts:', err);
        setPosts([]);
      });
  }, []);

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">My Tech Journey</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block p-4 border rounded hover:bg-gray-50">
            <h3 className="text-xl font-semibold">{post.title}</h3>
            <p className="text-sm text-gray-500">{post.summary}</p>
            <p className="text-xs text-gray-400 mt-2">{post.date}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
