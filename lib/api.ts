import { API_BASE_URL } from '@/utils/api';
import type { PostData, BlogPostFormData } from '@/types/blog';
import type { Category } from '@/types/category';

// Blog Posts
export async function getPosts(): Promise<PostData[]> {
  const res = await fetch(`${API_BASE_URL}/api/posts`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export async function getPost(slug: string): Promise<PostData> {
  const res = await fetch(`${API_BASE_URL}/api/posts/${slug}`);
  if (!res.ok) throw new Error('Failed to fetch post');
  return res.json();
}

export async function createPost(data: BlogPostFormData, token: string): Promise<PostData> {
  const res = await fetch(`${API_BASE_URL}/api/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create post');
  return res.json();
}

export async function updatePost(slug: string, data: BlogPostFormData, token: string): Promise<PostData> {
  const res = await fetch(`${API_BASE_URL}/api/posts/${slug}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update post');
  return res.json();
}

export async function deletePost(slug: string) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API_BASE_URL}/api/posts/${slug}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    throw new Error('Failed to delete post');
  }
  return res.json();
}

// Categories
export async function getCategories(): Promise<Record<string, Category[]>> {
  const res = await fetch(`${API_BASE_URL}/api/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

// Image Upload
export async function uploadImage(file: File, token: string): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/api/upload-url`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: file.name, content_type: file.type }),
  });
  if (!res.ok) throw new Error('Failed to get upload URL');
  const { upload_url, file_url } = await res.json();
  await fetch(upload_url, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
  return file_url;
}

// Contact
export async function sendContact(form: { name: string; email: string; message: string }): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  if (!res.ok) throw new Error('Failed to send contact form');
  return res.json();
} 