import { useState, useEffect, FormEvent } from "react";
import { API_BASE_URL } from "@/utils/api";
import Link from "next/link";

interface FormProps {
  initial?: {
    title: string;
    slug: string;
    summary: string;
    content: string;
    status?: "draft" | "published";
    categories?: string[];
    featuredImage?: string;
  };
  onSubmit: (data: {
    title: string;
    slug: string;
    summary: string;
    content: string;
    status: "draft" | "published";
    categories: string[];
    featuredImage?: string;
  }) => Promise<void>;
  isEdit?: boolean;
}

const AdminPostForm = ({ initial, onSubmit, isEdit = false }: FormProps) => {
  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [summary, setSummary] = useState(initial?.summary || "");
  const [content, setContent] = useState(initial?.content || "");
  const [status, setStatus] = useState<"draft" | "published">(initial?.status || "draft");
  const [categories, setCategories] = useState<string[]>(initial?.categories || []);
  const [featuredImage, setFeaturedImage] = useState(initial?.featuredImage || "");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    try {
      let finalImageUrl = featuredImage;

      if (pendingFile) {
        setUploading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token");

        const res = await fetch(`${API_BASE_URL}/api/upload-url`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            filename: pendingFile.name,
            content_type: pendingFile.type,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Failed to get presigned URL");

        const uploadRes = await fetch(data.upload_url, {
          method: "PUT",
          headers: {
            "Content-Type": pendingFile.type,
          },
          body: pendingFile,
        });

        if (!uploadRes.ok) throw new Error("Upload failed");
        finalImageUrl = data.file_url;
      }

      await onSubmit({ title, slug, summary, content, status, categories, featuredImage: finalImageUrl });
      setPendingFile(null);
    } catch (err: any) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setUploading(false);
    }
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value, checked } = e.target;
    setCategories(checked ? [...categories, value] : categories.filter(c => c !== value));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPendingFile(file);
  }

  function handleClearImage() {
    setFeaturedImage("");
    setPendingFile(null);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="text-red-600">{error}</p>}

      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="input" />
      <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Slug" className="input" disabled={isEdit} />
      <textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Summary" className="textarea" />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content (HTML allowed)" className="textarea" />

      <div>
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value as "draft" | "published")} className="select">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div>
        <label>Categories:</label>
        {["tech", "life", "career"].map((cat) => (
          <label key={cat} className="block">
            <input type="checkbox" value={cat} checked={categories.includes(cat)} onChange={handleCategoryChange} />
            {cat}
          </label>
        ))}
      </div>

      <div>
        <label>Featured Image:</label>
        {!featuredImage && !pendingFile && <input type="file" accept="image/*" onChange={handleFileChange} />}
        {uploading && <p>Uploading...</p>}
        {(featuredImage || pendingFile) && (
          <div className="relative">
            <img
              src={pendingFile ? URL.createObjectURL(pendingFile) : featuredImage}
              alt="Featured"
              className="mt-2 h-32 object-cover rounded"
            />
            <button
              type="button"
              onClick={handleClearImage}
              className="absolute top-1 right-1 bg-white border px-2 py-1 rounded text-sm"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      <button type="submit" className="btn">
        {isEdit ? "Update Post" : "Create Post"}
      </button>

      {isEdit && status === "published" && (
        <Link href={`/blog/${slug}`} className="inline-block ml-4 text-blue-600 underline">
          View post
        </Link>
      )}
    </form>
  );
};

export default AdminPostForm;
