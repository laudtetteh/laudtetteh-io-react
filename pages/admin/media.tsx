import { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import { useFlashMessage } from "@/lib/useFlashMessage";

interface S3Image {
  key: string;
  url: string;
  size: number;
  last_modified: string;
}

interface UploadProgress {
  filename: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export default function AdminMedia() {
  const [images, setImages] = useState<S3Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [preview, setPreview] = useState<S3Image | null>(null);
  const imagesPerPage = 20;
  const { redirectWithMessage, pushMessage } = useFlashMessage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/images`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setImages(await res.json());
    }
    setLoading(false);
  };

  const handleDelete = async (key: string) => {
    if (!window.confirm("Delete this image?")) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    const encodedKey = encodeURIComponent(key);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/images/${encodedKey}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setImages(images.filter((img) => img.key !== key));
      setSelected(selected.filter((k) => k !== key));
      redirectWithMessage("/admin/media", "Image deleted", "top-center", "push", "success");
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selected.length} images? This cannot be undone.`)) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    let successCount = 0;
    for (const key of selected) {
      const encodedKey = encodeURIComponent(key);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/images/${encodedKey}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) successCount++;
    }
    setImages(images.filter((img) => !selected.includes(img.key)));
    setSelected([]);
    redirectWithMessage("/admin/media", `${successCount} image(s) deleted`, "top-center", "push", "success");
  };

  const toggleSelect = (key: string) => {
    setSelected((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
  };

  // Select All logic
  const filteredImages = images.filter(img =>
    img.key.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredImages.length / imagesPerPage);
  const paginatedImages = filteredImages.slice((currentPage - 1) * imagesPerPage, currentPage * imagesPerPage);
  const currentPageImages = paginatedImages;
  const allCurrentSelected = currentPageImages.length > 0 && 
    currentPageImages.every(img => selected.includes(img.key));
  const someCurrentSelected = currentPageImages.some(img => selected.includes(img.key));

  const toggleSelectAll = () => {
    if (allCurrentSelected) {
      // Deselect all on current page
      setSelected(selected.filter(key => 
        !currentPageImages.some(img => img.key === key)
      ));
    } else {
      // Select all on current page
      const newSelected = [...selected];
      currentPageImages.forEach(img => {
        if (!newSelected.includes(img.key)) {
          newSelected.push(img.key);
        }
      });
      setSelected(newSelected);
    }
  };

  // Enhanced file upload logic
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const uploadFile = async (file: File): Promise<void> => {
    const updateProgress = (filename: string, progress: number, status: UploadProgress['status'], error?: string) => {
      setUploadProgress(prev => {
        const existing = prev.findIndex(p => p.filename === filename);
        if (existing === -1) {
          return [...prev, { filename, progress, status, error }];
        }
        const newProgress = [...prev];
        newProgress[existing] = { filename, progress, status, error };
        return newProgress;
      });
    };

    try {
      updateProgress(file.name, 0, 'uploading');
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");

      // Get presigned URL
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/upload-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ filename: file.name, content_type: file.type }),
      });
      if (!res.ok) throw new Error("Failed to get upload URL");
      const { upload_url } = await res.json();

      // Upload to S3 with progress tracking
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", upload_url);
        xhr.setRequestHeader("Content-Type", file.type);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            updateProgress(file.name, percentComplete, 'uploading');
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            updateProgress(file.name, 100, 'success');
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.send(file);
      });

    } catch (err: any) {
      updateProgress(file.name, 0, 'error', err.message || "Upload failed");
      throw err;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress([]);

    try {
      await Promise.all(files.map(uploadFile));
      pushMessage(`Successfully uploaded ${files.length} file(s)!`, "top-center", "success");
      await fetchImages();
    } catch (err: any) {
      pushMessage(`Some uploads failed. Check the progress for details.`, "top-center", "error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      // Clear progress after a delay
      setTimeout(() => setUploadProgress([]), 3000);
    }
  };

  // Modal logic
  const closeModal = () => setPreview(null);

  return (
    <Layout title="Media Library | Laud Tetteh" description="Admin media library for managing uploads.">
      <div className="max-w-6xl mx-auto py-12 px-6">
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold">🖼️ Media Library</h1>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              className="border rounded px-3 py-2 text-sm"
            />
            <button
              onClick={handleUploadClick}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm flex items-center gap-2"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Uploading...</span>
                </>
              ) : (
                <>📤 Upload</>
              )}
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
            {selected.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm"
              >
                Delete Selected ({selected.length})
              </button>
            )}
          </div>
        </div>

        {/* Upload Progress */}
        {uploadProgress.length > 0 && (
          <div className="mb-6 space-y-2">
            {uploadProgress.map(({ filename, progress, status, error }) => (
              <div key={filename} className="bg-gray-50 p-2 rounded text-sm flex items-center gap-2">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="truncate">{filename}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        status === 'error' ? 'bg-red-600' :
                        status === 'success' ? 'bg-green-600' : 'bg-blue-600'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                {error && <span className="text-red-600 text-xs">{error}</span>}
              </div>
            ))}
          </div>
        )}

        {/* Select All Checkbox */}
        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={allCurrentSelected}
            ref={el => {
              if (el) el.indeterminate = !allCurrentSelected && someCurrentSelected;
            }}
            onChange={toggleSelectAll}
            className="h-5 w-5"
          />
          <span className="text-sm">Select all on this page</span>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading images...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedImages.map((img) => (
                <div key={img.key} className="relative border rounded shadow bg-white p-2 flex flex-col items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selected.includes(img.key)}
                    onChange={e => { e.stopPropagation(); toggleSelect(img.key); }}
                    className="absolute top-2 left-2 z-10 h-5 w-5"
                  />
                  <img
                    src={img.url}
                    alt={img.key}
                    className="object-cover w-full h-32 rounded mb-2 group-hover:opacity-80"
                    onClick={() => setPreview(img)}
                  />
                  <div className="text-xs break-all mb-1">{img.key.replace(/^uploads\//, "")}</div>
                  <div className="text-xs text-gray-500 mb-1">{(img.size / 1024).toFixed(1)} KB</div>
                  <div className="text-xs text-gray-400 mb-2">{img.last_modified ? new Date(img.last_modified).toLocaleString() : ""}</div>
                  <button
                    onClick={e => { e.stopPropagation(); handleDelete(img.key); }}
                    className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                  >
                    Delete
                  </button>
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
        {/* Image Preview Modal */}
        {preview && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
                aria-label="Close"
              >
                &times;
              </button>
              <img src={preview.url} alt={preview.key} className="w-full max-h-96 object-contain mb-4 rounded" />
              <div className="text-sm break-all mb-2"><strong>Key:</strong> {preview.key}</div>
              <div className="text-sm text-gray-500 mb-2"><strong>Size:</strong> {(preview.size / 1024).toFixed(1)} KB</div>
              <div className="text-sm text-gray-400 mb-2"><strong>Last Modified:</strong> {preview.last_modified ? new Date(preview.last_modified).toLocaleString() : ""}</div>
              <a href={preview.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">Open in new tab</a>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 