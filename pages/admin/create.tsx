import { useRouter } from "next/router";
import AdminPostForm from "@/components/AdminPostForm";
import UseAuthRedirect from "@/lib/UseAuthRedirect";

export default function CreatePostPage() {
  UseAuthRedirect();

  const router = useRouter();

  async function handleSubmit(data: any) {
    const token = localStorage.getItem("token");

    // Enforce unique slug warning if missing
    if (!data.slug || !data.slug.trim()) {
      alert("Slug is required and must be unique.");
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/admin"); // ✅ Redirect to dashboard to wait for ISR to catch up
    } else if (res.status === 400) {
      const err = await res.json();
      alert(`❌ ${err.detail}`);
    } else {
      alert("Failed to create post");
    }
  }

  return <AdminPostForm onSubmit={handleSubmit} />;
}
