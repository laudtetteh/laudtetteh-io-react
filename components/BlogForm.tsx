import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";

interface BlogPostFormData {
  title: string;
  slug: string;
  summary: string;
  content: string;
  date?: string;
}

interface BlogFormProps {
  initialData?: BlogPostFormData;
  isEditing?: boolean;
}

export default function BlogForm({ initialData, isEditing = false }: BlogFormProps) {
  const [formData, setFormData] = useState<BlogPostFormData>(
    initialData || {
      title: "",
      slug: "",
      summary: "",
      content: "",
    }
  );

  const [preview, setPreview] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  // Handle input changes
  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  // Handle image upload to S3
  async function handleImageUpload() {
    if (!image) return;

    setUploading(true);
    const res = await fetch("/api/sign-upload?filename=" + encodeURIComponent(image.name));
    const { url, fields, key } = await res.json();

    const formDataUpload = new FormData();
    Object.entries(fields).forEach(([k, v]) => {
      formDataUpload.append(k, v as string);
    });
    formDataUpload.append("file", image);

    const uploadRes = await fetch(url, {
      method: "POST",
      body: formDataUpload,
    });

    setUploading(false);

    if (uploadRes.ok) {
      const imageUrl = `${url}/${key}`;
      setFormData((prev) => ({
        ...prev,
        content: prev.content + `\n\n<img src="${imageUrl}" alt="uploaded image" />`,
      }));
    } else {
      alert("Image upload failed");
    }
  }

  // Submit form
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const endpoint = isEditing
      ? `/api/posts/${formData.slug}`
      : "/api/posts";

    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      alert("Error saving post");
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 border"
          name="slug"
          placeholder="Slug"
          value={formData.slug}
          onChange={handleChange}
          disabled={isEditing}
        />
        <textarea
          className="w-full p-2 border"
          name="summary"
          placeholder="Summary"
          rows={2}
          value={formData.summary}
          onChange={handleChange}
        />
        <textarea
          className="w-full p-2 border"
          name="content"
          placeholder="HTML Content"
          rows={10}
          value={formData.content}
          onChange={handleChange}
        />

        <div className="flex gap-4 items-center">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
          <button
            type="button"
            onClick={handleImageUpload}
            disabled={uploading || !image}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </div>

        <div className="flex gap-4">
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
            {isEditing ? "Update Post" : "Publish Post"}
          </button>
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            {preview ? "Edit Mode" : "Preview"}
          </button>
        </div>
      </form>

      {preview && (
        <div className="border p-4 bg-white">
          <h3 className="text-xl font-bold mb-2">{formData.title}</h3>
          <p className="text-sm text-gray-500">{formData.summary}</p>
          <div
            className="mt-4 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: formData.content }}
          />
        </div>
      )}
    </div>
  );
}
