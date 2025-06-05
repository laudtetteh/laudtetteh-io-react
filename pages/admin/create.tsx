import { useRouter } from "next/router";
import AdminPostForm from "@/components/AdminPostForm";
import useAuthRedirect from "@/lib/useAuthRedirect";

export default function CreatePostPage() {
  useAuthRedirect();

  const router = useRouter();

  async function handleSubmit(data: any) {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (res.ok) router.push("/admin");
    else alert("Failed to create post");
  }

  return <AdminPostForm onSubmit={handleSubmit} />;
}
