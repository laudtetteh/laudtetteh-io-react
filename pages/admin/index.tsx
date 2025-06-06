import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import UseAuthRedirect from "@/lib/UseAuthRedirect";

interface BlogPost {
  title: string;
  slug: string;
  summary: string;
  date: string;
}

export default function AdminDashboard() {
  UseAuthRedirect();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/admin/posts`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch posts");
        return res.json();
      })
      .then(setPosts)
      .catch((err) => {
        console.error(err);
        setError("Unauthorized or failed to load posts.");
      });
  }, [router]);

  async function handleDelete(slug: string) {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!confirm("Are you sure you want to delete this post?")) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/posts/${slug}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setPosts(posts.filter((post) => post.slug !== slug));
    } else {
      alert("Failed to delete post.");
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">📋 Admin Dashboard</h1>
      {error && <p className="text-red-600">{error}</p>}
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.slug} className="border p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <p className="text-sm text-gray-500">{post.date}</p>
              <div className="mt-2 flex gap-4">
                <button
                  onClick={() => router.push(`/admin/edit/${post.slug}`)}
                  className="text-blue-600 hover:underline"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => router.push(`/blog/${post.slug}`)}
                  className="text-green-600 hover:underline"
                >
                  🔍 View
                </button>
                <button
                  onClick={() => handleDelete(post.slug)}
                  className="text-red-600 hover:underline"
                >
                  🗑️ Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
