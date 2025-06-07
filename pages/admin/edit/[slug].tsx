import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminPostForm from "@/components/AdminPostForm";
import UseAuthRedirect from "@/lib/UseAuthRedirect";

const API_URL = process.env.NEXT_PUBLIC_API_BROWSER;

interface BlogPost {
  title: string;
  slug: string;
  summary: string;
  content: string;
  status?: "draft" | "published";
  categories?: string[];
  featuredImage?: string;
}

export default function EditPostPage() {
  UseAuthRedirect();

  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (!slug) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    fetch(`${API_URL}/api/posts/${slug}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch post");
        return res.json();
      })
      .then(setPost)
      .catch((err) => {
        console.error("Failed to fetch post:", err);
      });
  }, [slug]);

  async function handleSubmit(updated: BlogPost) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    const res = await fetch(`${API_URL}/api/posts/${slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updated),
    });

    if (res.ok) router.push("/admin");
    else alert("Failed to update post.");
  }

  if (!post) return <p className="p-6 text-center">Loading post...</p>;

  return <AdminPostForm initial={post} onSubmit={handleSubmit} isEdit />;
}
