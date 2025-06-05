import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminPostForm from "@/components/AdminPostForm";
import useAuthRedirect from "@/lib/useAuthRedirect";

export default function EditPostPage() {
  useAuthRedirect();

  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    fetch(`/api/posts/${slug}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setPost)
      .catch((err) => {
        console.error("Failed to fetch post:", err);
      });
  }, [slug]);

  async function handleSubmit(updated: any) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    const res = await fetch(`/api/posts/${slug}`, {
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
