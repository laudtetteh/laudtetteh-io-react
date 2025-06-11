'use client';

import { useRouter } from 'next/router';
import { useEffect } from 'react';

import AdminPostForm from '@/components/AdminPostForm';
import { useFlashMessage } from '@/lib/useFlashMessage';
import type { PostData } from '@/types/blog';
import { createPost } from '@/lib/api';

export default function CreatePostPage() {
  const router = useRouter();
  const { pushMessage } = useFlashMessage();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/admin/login');
  }, [router]);

  const handleCreate = async (data: PostData) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    await createPost(data, token);
    pushMessage('Post created successfully!', 'top-center', 'success');
    router.push('/admin');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold">➕ Create New Post</h1>
      <AdminPostForm onSubmit={handleCreate} />
    </div>
  );
}
