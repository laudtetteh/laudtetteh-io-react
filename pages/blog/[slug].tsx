import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

type BlogPost = {
  title: string;
  summary: string;
  date: string;
  featuredImage: string;
  categories: string[];
  slug: string;
  content: string;
};

const BlogPostPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (slug) {
      fetch('/api/blog')
        .then(res => res.json())
        .then((data: BlogPost[]) => {
          const found = data.find(p => p.slug === slug);
          setPost(found || null);
        });
    }
  }, [slug]);

  if (!post) return <div className="max-w-2xl mx-auto py-12 px-4">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <img src={post.featuredImage} alt={post.title} className="w-full h-64 object-cover rounded mb-6" />
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-500 text-sm mb-4">{post.date}</p>
      <div className="mb-4">
        {post.categories.map(cat => (
          <span key={cat} className="inline-block bg-gray-200 dark:bg-gray-700 text-xs px-2 py-1 rounded mr-2">{cat}</span>
        ))}
      </div>
      <div className="prose dark:prose-invert max-w-none">
        {post.content}
      </div>
    </div>
  );
};

export default BlogPostPage; 