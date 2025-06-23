import Link from 'next/link';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/utils/api';
import { getPosts } from '@/lib/api';
import type { PostData } from '@/types/blog';

interface BlogPostSummary extends Omit<PostData, 'content' | 'categories' | 'status' | 'featured' | 'featuredImage' | 'weight'> {
  date?: string;
  date_published?: string;
}

export default function BlogSection() {
  console.log("📡 API_BASE_URL = ", API_BASE_URL);
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);

  useEffect(() => {
    getPosts()
      .then((data) => setPosts(data))
      .catch((err) => {
        console.error('Failed to load blog posts:', err);
        setPosts([]);
      });
  }, []);

  function formatDate(dateString?: string) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">My Tech Journey</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          // Use date_published if available, fallback to date
          const displayDate = post.date_published || post.date;
          const formattedDate = formatDate(displayDate);
          
          return (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block p-4 border rounded hover:bg-gray-50">
              <h3 className="text-xl font-semibold">{post.title}</h3>
              <p className="text-sm text-gray-500">{post.summary}</p>
              {formattedDate && <p className="text-xs text-gray-400 mt-2">{formattedDate}</p>}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
 