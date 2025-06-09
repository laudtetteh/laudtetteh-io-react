'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AdminPostForm from '@/components/AdminPostForm';
import { useFlashMessage } from '@/hooks/useFlashMessage';
import dynamic from 'next/dynamic';

interface BlogPost {
  title: string;
  slug: string;
  summary: string;
  content: string;
  categories: string[];
  status: 'draft' | 'published';
  featured: boolean;
  featuredImage?: string;
  weight?: number;
}

export default function EditPostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { redirectWithMessage, pushMessage } = useFlashMessage();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug || typeof slug !== 'string') return;

    const token = localStorage.getItem('token');
    if (!token) {
      redirectWithMessage('/admin/login', "You are not authenticated. Please log in again.", "top-center", "push", "error");
      return;
    }

    const fetchPost = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/posts/${slug}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch post');
        const data = await res.json();
        setPost(data);
      } catch (err: any) {
        console.error(err);
        pushMessage(`Error loading post: ${err.message}`, 'top-center', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

    const handleUpdate = async (updated: BlogPost) => {
    const token = localStorage.getItem('token');

    if (!token) {
      redirectWithMessage('/admin/login', "You are not authenticated. Please log in again.", "top-center", "push", "error");
      return;
    }

    const cleaned = Object.fromEntries(
      Object.entries(updated).filter(([_, value]) => value !== undefined)
    );

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/posts/${slug}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleaned),
      });

      if (res.ok) {
        redirectWithMessage('/admin', "Post updated successfully!", "top-center", "push", "success");
      } else {
        if (res.status === 401) {
          redirectWithMessage('/admin/login', "Your session has expired. Please log in again.", "top-center", "push", "info");
          return;
        }

        const error = await res.json();
        pushMessage(`Failed to update post: ${error.detail || 'Unknown error'}`, 'top-center', 'error');
      }
    } catch (err: any) {
      console.error('Update failed:', err);
      pushMessage(`Network error: ${err.message}`, 'top-center', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">✏️ Edit Post</h1>
      {post ? (
        <AdminPostForm initialData={post} onSubmit={handleUpdate} isEdit />
      ) : (
        <p className="text-gray-500">Loading post data…</p>
      )}
    </div>
  );
}
