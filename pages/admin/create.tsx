'use client';

import { useRouter } from 'next/router';
import { useEffect } from 'react';
import AdminPostForm from '@/components/AdminPostForm';
import { useFlashMessage } from '@/lib/useFlashMessage';

export default function CreatePostPage() {
  const router = useRouter();
  const { pushMessage } = useFlashMessage();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/admin/login');
  }, [router]);

  const handleCreate = async (data: any) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/posts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      pushMessage('Post created successfully!', 'top-center', 'success');
      router.push('/admin');
    } else {
      const error = await res.json();
      pushMessage(`Failed to create post: ${error.detail || 'Unknown error'}`, 'top-center', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">➕ Create New Post</h1>
      <AdminPostForm onSubmit={handleCreate} />
    </div>
  );
}
