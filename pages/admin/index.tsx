import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useFlashMessage } from "@/lib/useFlashMessage";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import UseAuthRedirect from "@/lib/UseAuthRedirect";
import Layout from '@/components/Layout';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

interface BlogPost {
  title: string;
  slug: string;
  summary: string;
  date: string;
  date_published?: string;
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
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: post.slug });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white"
    >
      {post.featuredImage && (
        <img
          src={post.featuredImage}
          alt="Cover"
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4 space-y-2">
        <div className="flex flex-wrap items-center justify-between">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                post.status === "published"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {post.status}
            </span>
            {/* ✅ Apply drag handle only here */}
            <span
              className="cursor-move text-gray-400 text-lg"
              title="Drag to reorder"
              {...attributes}
              {...listeners}
            >
              ≡
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-500">
          {post.date_published
            ? `Published: ${format(toZonedTime(new Date(post.date_published), 'America/Los_Angeles'), 'MM/dd/yyyy')}`
            : "Not published"}
        </p>

        {post.categories?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.categories.map((cat) => (
              <span
                key={cat}
                className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-4 mt-4">
          <button onClick={onEdit} className="text-blue-600 hover:underline">✏️ Edit</button>
          <button onClick={onView} className="text-green-600 hover:underline">🔍 View</button>
          <button onClick={onDelete} className="text-red-600 hover:underline">🗑️ Delete</button>
        </div>
      </div>
    </li>
  );
}

export default function AdminDashboard() {
  UseAuthRedirect();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkCategory, setBulkCategory] = useState("");
  const [bulkStatus, setBulkStatus] = useState("");
  const postsPerPage = 9;
  const router = useRouter();
  const sensors = useSensors(useSensor(PointerSensor));
  const { redirectWithMessage } = useFlashMessage();

  useEffect(() => {
    const loadPosts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/admin/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401) {
            // Token is invalid, redirect to login
            localStorage.removeItem("token");
            router.push("/admin/login");
            return;
          }
          throw new Error("Failed to load posts");
        }

        const fetchedPosts = await res.json();
        const withWeights = fetchedPosts.map((p: BlogPost, i: number) => ({
          ...p,
          weight: p.weight ?? i,
        }));
        setPosts(withWeights);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load posts. Please try again.");
        setLoading(false);
      }
    };

    // Small delay to ensure auth check completes
    const timer = setTimeout(loadPosts, 100);
    return () => clearTimeout(timer);
  }, [router]);

  const allCategories = useMemo(() => {
    const cats = new Set(posts.flatMap((p) => p.categories || []));
    return Array.from(cats);
  }, [posts]);

  const filtered = useMemo(() => (
    posts
      .filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
      .filter(p => !statusFilter || p.status === statusFilter)
      .filter(p => !categoryFilter || p.categories.includes(categoryFilter))
      .filter(p =>
        !dateFilter ||
        new Date(p.date).toDateString() === new Date(dateFilter).toDateString()
      )
      .sort((a, b) => {
        const aDate = a.date_published ? new Date(a.date_published).getTime() : 0;
        const bDate = b.date_published ? new Date(b.date_published).getTime() : 0;
        return bDate - aDate;
      })
  ), [posts, search, statusFilter, categoryFilter, dateFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / postsPerPage);
  const paginatedPosts = filtered.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  // Bulk selection logic
  const allVisibleSlugs = paginatedPosts.map((p) => p.slug);
  const allSelected = allVisibleSlugs.every((slug) => selected.includes(slug)) && allVisibleSlugs.length > 0;
  const someSelected = allVisibleSlugs.some((slug) => selected.includes(slug));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected(selected.filter((slug) => !allVisibleSlugs.includes(slug)));
    } else {
      setSelected([...new Set([...selected, ...allVisibleSlugs])]);
    }
  };

  const toggleSelect = (slug: string) => {
    setSelected((prev) => prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]);
  };

  // Bulk delete handler
  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selected.length} posts? This cannot be undone.`)) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    let successCount = 0;
    for (const slug of selected) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/posts/${slug}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        successCount++;
      }
    }
    setPosts(posts.filter((p) => !selected.includes(p.slug)));
    setSelected([]);
    redirectWithMessage('/admin', `${successCount} post(s) deleted`, 'top-center', 'push', 'success');
  };

  // Bulk category/status change handlers (now implemented)
  const handleBulkCategory = async () => {
    if (!bulkCategory) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    let successCount = 0;
    for (const slug of selected) {
      const post = posts.find((p) => p.slug === slug);
      if (!post) continue;
      const updatedCategories = Array.from(new Set([...post.categories, bulkCategory]));
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/posts/${slug}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...post, categories: updatedCategories }),
      });
      if (res.ok) {
        successCount++;
      }
    }
    setPosts(posts.map((p) => selected.includes(p.slug) ? { ...p, categories: Array.from(new Set([...p.categories, bulkCategory])) } : p));
    setSelected([]);
    setBulkCategory("");
    redirectWithMessage('/admin', `${successCount} post(s) updated with category`, 'top-center', 'push', 'success');
  };

  const handleBulkStatus = async () => {
    if (!bulkStatus) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    let successCount = 0;
    for (const slug of selected) {
      const post = posts.find((p) => p.slug === slug);
      if (!post) continue;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/posts/${slug}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...post, status: bulkStatus }),
      });
      if (res.ok) {
        successCount++;
      }
    }
    setPosts(posts.map((p) => selected.includes(p.slug) ? { ...p, status: bulkStatus } : p));
    setSelected([]);
    setBulkStatus("");
    redirectWithMessage('/admin', `${successCount} post(s) updated with status`, 'top-center', 'push', 'success');
  };

  const handleDelete = async (slug: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!confirm("Are you sure you want to delete this post?")) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/posts/${slug}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setPosts(posts.filter((p) => p.slug !== slug));
      redirectWithMessage('/admin', "Post deleted", "top-center", "push", "success");
    } else {
      alert("Failed to delete post.");
    }
  };

  const handleDragEnd = async (event: any) => {
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
      })
    );

    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/admin/update-weights`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            newSorted.map((p) => ({ slug: p.slug, weight: p.weight }))
          ),
        });
      } catch (err) {
        console.error("❌ Failed to update weights:", err);
      }
    }
  };

  return (
    <Layout title="Admin Dashboard | Laud Tetteh" description="Admin dashboard for managing blog posts and site content.">
      <div className="max-w-6xl mx-auto py-12 px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">🛠️ Admin Dashboard</h1>
          <button
            onClick={() => router.push("/admin/create")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            ➕ New Post
          </button>
        </div>

        {/* Bulk Actions Bar */}
        {selected.length > 0 && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded flex flex-wrap items-center gap-4">
            <span className="font-semibold">{selected.length} selected</span>
            <button onClick={handleBulkDelete} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
            <select value={bulkCategory} onChange={e => setBulkCategory(e.target.value)} className="border rounded px-2 py-1">
              <option value="">Change Category</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button onClick={handleBulkCategory} className="bg-gray-200 px-2 py-1 rounded">Apply</button>
            <select value={bulkStatus} onChange={e => setBulkStatus(e.target.value)} className="border rounded px-2 py-1">
              <option value="">Change Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <button onClick={handleBulkStatus} className="bg-gray-200 px-2 py-1 rounded">Apply</button>
            <button onClick={() => setSelected([])} className="ml-auto text-blue-600 underline">Clear</button>
          </div>
        )}

        <div className="mb-6 flex items-center gap-2">
          <input
            type="checkbox"
            checked={allSelected}
            ref={el => { if (el) el.indeterminate = !allSelected && someSelected; }}
            onChange={toggleSelectAll}
            className="mr-2"
          />
          <span className="text-sm">Select All</span>
        </div>

        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="🔍 Search title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded px-3 py-2"
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
            className="border rounded px-3 py-2"
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading posts...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedPosts.map((post) => (
                <div key={post.slug} className="relative">
                  <input
                    type="checkbox"
                    checked={selected.includes(post.slug)}
                    onChange={() => toggleSelect(post.slug)}
                    className="absolute top-2 left-2 z-10 h-5 w-5"
                  />
                  <SortablePost
                    post={post}
                    onEdit={() => router.push(`/admin/edit/${post.slug}`)}
                    onView={() => router.push(`/blog/${post.slug}`)}
                    onDelete={() => handleDelete(post.slug)}
                  />
                </div>
              ))}
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  className="px-3 py-1 rounded border bg-white disabled:opacity-50"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`px-3 py-1 rounded border ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white'}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="px-3 py-1 rounded border bg-white disabled:opacity-50"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
