'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AdminPostForm from '@/components/AdminPostForm';
import { useFlashMessage } from '@/lib/useFlashMessage';
import Layout from '@/components/Layout';

interface BlogPost {
  title: string;
  slug: string;
  summary: string;
  content: { html: string };
  categories: string[];
  status: 'draft' | 'published';
  featured: boolean;
  featuredImage?: string;
  weight?: number;
  date_published?: string;
}

export default function EditPostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { redirectWithMessage, pushMessage } = useFlashMessage();

  const [post, setPost] = useState<BlogPost | null>(null);

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
      } catch (err) {
        console.error(err);
        const message = err instanceof Error ? err.message : 'Unknown error';
        pushMessage(`Error loading post: ${message}`, 'top-center', 'error');
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
      Object.entries(updated).filter(([, value]) => value !== undefined)
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
    } catch (err) {
      console.error('Update failed:', err);
      const message = err instanceof Error ? err.message : 'Unknown error';
      pushMessage(`Network error: ${message}`, 'top-center', 'error');
    }
  };

  return (
    <Layout title={post ? `Edit: ${Array.isArray(post.title) ? post.title.join(' ') : post.title} | Laud Tetteh` : 'Edit Post | Laud Tetteh'} description={post ? `Edit the post '${Array.isArray(post.title) ? post.title.join(' ') : post.title}' as an admin.` : 'Edit a blog post as an admin.'}>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">✏️ Edit Post</h1>
        {post ? (
          <AdminPostForm initialData={post} onSubmit={handleUpdate} isEdit />
        ) : (
          <p className="text-gray-500">Loading post data…</p>
        )}
      </div>
    </Layout>
  );
}
