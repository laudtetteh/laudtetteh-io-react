import { useState, useRef } from "react";

interface FormProps {
  initial?: {
    title: string;
    slug: string;
    summary: string;
    content: string;
    status?: "draft" | "published";
    categories?: string[];
  };
  onSubmit: (data: {
    title: string;
    slug: string;
    summary: string;
    content: string;
    status: "draft" | "published";
    categories: string[];
  }) => Promise<void>;
  isEdit?: boolean;
}

export default function AdminPostForm({ initial, onSubmit, isEdit = false }: FormProps) {
  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [summary, setSummary] = useState(initial?.summary || "");
  const [content, setContent] = useState(initial?.content || "");
  const [status, setStatus] = useState<"draft" | "published">(initial?.status || "draft");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await onSubmit({ title, slug, summary, content, status, categories });
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    }
  }

  async function handleUpload() {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    setPreviewUrl("");

    try {
      const res = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, content_type: file.type }),
      });

      const { url, key } = await res.json();
      await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type, "ACL": "public-read" },
        body: file,
      });

      const publicUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
      setPreviewUrl(publicUrl);
    } catch (err) {
      console.error("Upload failed", err);
      setError("Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function insertImageIntoContent() {
    if (previewUrl) {
      setContent(content + `<p><img src="${previewUrl}" alt="Image" /></p>`);
      setPreviewUrl("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const [categories, setCategories] = useState<string[]>(initial?.categories || []);
  const allCategories = ["Tech", "Life", "Career", "DevOps", "Personal"];

  function toggleCategory(cat: string) {
    setCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-semibold">{isEdit ? "Edit" : "Create"} Post</h2>
        {error && <p className="text-red-500">{error}</p>}

        <select
          className="w-full p-2 border border-gray-300 rounded"
          value={status}
          onChange={e => setStatus(e.target.value as "draft" | "published")}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <div>
          <label className="block font-medium mb-1">Categories:</label>
          <div className="flex flex-wrap gap-4">
            {allCategories.map(cat => (
              <label key={cat} className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={categories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        <input
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <input
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Slug"
          value={slug}
          onChange={e => setSlug(e.target.value)}
          required
          disabled={isEdit}
        />

        <input
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Summary"
          value={summary}
          onChange={e => setSummary(e.target.value)}
          required
        />

        <textarea
          className="w-full p-2 border border-gray-300 rounded h-40"
          placeholder="Content (HTML allowed)"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />

        <div>
          <label className="block font-medium mb-1">Upload image:</label>
          <input type="file" ref={fileInputRef} className="mb-2" />
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>

          {previewUrl && (
            <div className="mt-4">
              <img src={previewUrl} alt="Preview" className="max-w-full rounded shadow" />
              <button
                type="button"
                onClick={insertImageIntoContent}
                className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Insert into Content
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          {isEdit ? "Update" : "Create"}
        </button>
      </form>

      <div className="prose max-w-none mt-8 md:mt-0">
        <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
        <div
          className="prose prose-lg"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}
