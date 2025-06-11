'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import AdminPostForm from '@/components/AdminPostForm';
import { useFlashMessage } from '@/lib/useFlashMessage';
import type { PostData } from '@/types/blog';

export default function EditPostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { redirectWithMessage, pushMessage } = useFlashMessage();

  const [post, setPost] = useState<PostData | null>(null);

  useEffect(() => {
    if (!slug || typeof slug !== 'string') return;

    const token = localStorage.getItem('token');
    if (!token) {
      redirectWithMessage(
        '/admin/login',
        'You are not authenticated. Please log in again.',
        'top-center',
        'push',
        'error',
      );
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
      } catch (err: unknown) {
        console.error(err);
        pushMessage(
          `Error loading post: ${err instanceof Error ? err.message : 'Unknown error'}`,
          'top-center',
          'error',
        );
      }
    };

    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleUpdate = async (updated: PostData) => {
    const token = localStorage.getItem('token');

    if (!token) {
      redirectWithMessage(
        '/admin/login',
        'You are not authenticated. Please log in again.',
        'top-center',
        'push',
        'error',
      );
      return;
    }

    const cleaned = Object.fromEntries(
      Object.entries(updated).filter(([, value]) => value !== undefined),
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
        redirectWithMessage(
          '/admin',
          'Post updated successfully!',
          'top-center',
          'push',
          'success',
        );
      } else {
        if (res.status === 401) {
          redirectWithMessage(
            '/admin/login',
            'Your session has expired. Please log in again.',
            'top-center',
            'push',
            'info',
          );
          return;
        }

        const error = await res.json();
        pushMessage(
          `Failed to update post: ${error.detail || 'Unknown error'}`,
          'top-center',
          'error',
        );
      }
    } catch (err: unknown) {
      console.error('Update failed:', err);
      pushMessage(
        `Network error: ${err instanceof Error ? err.message : 'Unknown error'}`,
        'top-center',
        'error',
      );
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold">✏️ Edit Post</h1>
      {post ? (
        <AdminPostForm initialData={post} onSubmit={handleUpdate} isEdit />
      ) : (
        <p className="text-gray-500">Loading post data…</p>
      )}
    </div>
  );
}
