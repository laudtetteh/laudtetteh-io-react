import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';

import { useFlashMessage } from '@/lib/useFlashMessage';
import UseAuthRedirect from '@/lib/UseAuthRedirect';

interface BlogPost {
  title: string;
  slug: string;
  summary: string;
  date: string;
  status: string;
  categories: string[];
  featuredImage?: string;
  weight?: number;
}

function SortablePost({
  post,
  onEdit,
  onView,
  onDelete,
}: {
  post: BlogPost;
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: post.slug,
  });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
    >
      <Image
        src={post.featuredImage && post.featuredImage.trim() ? post.featuredImage : '/fallback.png'}
        alt={post.title}
        width={500}
        height={200}
        className="h-32 w-full object-cover"
      />
      <div className="space-y-2 p-4">
        <div className="flex flex-wrap items-center justify-between">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-1 text-xs ${
                post.status === 'published'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {post.status}
            </span>
            {/* ✅ Apply drag handle only here */}
            <span
              className="cursor-move text-lg text-gray-400"
              title="Drag to reorder"
              {...attributes}
              {...listeners}
            >
              ≡
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-500">
          {post.date ? `Created: ${new Date(post.date).toLocaleDateString()}` : 'No publish date'}
        </p>

        {post.categories?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.categories.map((cat) => (
              <span key={cat} className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-800">
                {cat}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex gap-4">
          <button onClick={onEdit} className="text-blue-600 hover:underline">
            ✏️ Edit
          </button>
          <button onClick={onView} className="text-green-600 hover:underline">
            🔍 View
          </button>
          <button onClick={onDelete} className="text-red-600 hover:underline">
            🗑️ Delete
          </button>
        </div>
      </div>
    </li>
  );
}

export default function AdminDashboard() {
  UseAuthRedirect();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const router = useRouter();
  const sensors = useSensors(useSensor(PointerSensor));
  const { redirectWithMessage } = useFlashMessage();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/admin/posts`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then((fetchedPosts) => {
        const withWeights = fetchedPosts.map((p: BlogPost, i: number) => ({
          ...p,
          weight: p.weight ?? i,
        }));
        setPosts(withWeights);
      })
      .catch((err) => {
        console.error(err);
        setError('Unauthorized or failed to load posts.');
        router.push('/admin/login');
      });
  }, [router]);

  const allCategories = useMemo(() => {
    const cats = new Set(posts.flatMap((p) => p.categories || []));
    return Array.from(cats);
  }, [posts]);

  const filtered = useMemo(
    () =>
      posts
        .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
        .filter((p) => !statusFilter || p.status === statusFilter)
        .filter((p) => !categoryFilter || p.categories.includes(categoryFilter))
        .filter(
          (p) =>
            !dateFilter || new Date(p.date).toDateString() === new Date(dateFilter).toDateString(),
        )
        .sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0)),
    [posts, search, statusFilter, categoryFilter, dateFilter],
  );

  const handleDelete = async (slug: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (!confirm('Are you sure you want to delete this post?')) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/posts/${slug}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setPosts(posts.filter((p) => p.slug !== slug));
      redirectWithMessage('/admin', 'Post deleted', 'top-center', 'push', 'success');
    } else {
      alert('Failed to delete post.');
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filtered.findIndex((p) => p.slug === active.id);
    const newIndex = filtered.findIndex((p) => p.slug === over.id);
    const newSorted = arrayMove(filtered, oldIndex, newIndex).map((p, i) => ({
      ...p,
      weight: i,
    }));

    setPosts((prev) =>
      prev.map((post) => {
        const updated = newSorted.find((p) => p.slug === post.slug);
        return updated ? { ...post, weight: updated.weight } : post;
      }),
    );

    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/admin/update-weights`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newSorted.map((p) => ({ slug: p.slug, weight: p.weight }))),
        });
      } catch (err) {
        console.error('❌ Failed to update weights:', err);
      }
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">🛠️ Admin Dashboard</h1>
        <button
          onClick={() => router.push('/admin/create')}
          className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          ➕ New Post
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <input
          type="text"
          placeholder="🔍 Search title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded border px-3 py-2"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded border px-3 py-2"
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded border px-3 py-2"
        >
          <option value="">All Categories</option>
          {allCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded border px-3 py-2"
        />
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={filtered.map((p) => p.slug)} strategy={verticalListSortingStrategy}>
          <ul className="space-y-6">
            {filtered.map((post) => (
              <SortablePost
                key={post.slug}
                post={post}
                onEdit={() => router.push(`/admin/edit/${post.slug}`)}
                onView={() => router.push(`/blog/${post.slug}`)}
                onDelete={() => handleDelete(post.slug)}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}
