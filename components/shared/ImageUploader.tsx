'use client';

import { useState, useEffect } from 'react';
import { uploadImage } from '@/lib/api';

interface ImageUploaderProps {
  imageUrl?: string;
  onChange: (url: string) => void;
}

export default function ImageUploader({ imageUrl, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [inputKey, setInputKey] = useState(Date.now());

  // Media library modal state
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryImages, setLibraryImages] = useState<{ url: string; key: string; last_modified?: string; size?: number }[]>([]);
  const [search, setSearch] = useState('');
  const [loadingLibrary, setLoadingLibrary] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const token = localStorage.getItem('token') || '';
    try {
      const file_url = await uploadImage(file, token);
      onChange(file_url);
    } catch (error) {
      console.error('❌ Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    const confirmed = window.confirm('Remove the image?');
    if (confirmed) {
      onChange('');
      setInputKey(Date.now());
    }
  };

  const fetchLibraryImages = async () => {
    setLoadingLibrary(true);
    const token = localStorage.getItem('token') || '';
    if (!token) {
      console.error("No auth token found");
      return;
    }

    try {
      const response = await fetch( `${ process.env.NEXT_PUBLIC_API_BROWSER }/api/images`, {
        headers: {
          'Authorization': `Bearer ${ token }`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Ensure data is an array before setting
      if (Array.isArray(data)) {
        setLibraryImages(data);
      } else {
        console.error("API did not return an array:", data);
        setLibraryImages([]);
      }
    } catch (e) {
      console.error("Failed to fetch library images:", e);
      setLibraryImages([]);
    } finally {
      setLoadingLibrary(false);
    }
  };

  useEffect(() => {
    if (showLibrary) fetchLibraryImages();
  }, [showLibrary]);

  return (
    <div suppressHydrationWarning>
      <label className="mb-1.5 block text-sm font-medium text-slate-900">Featured Image</label>
      <input
        key={inputKey}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="block mt-1 text-sm text-slate-700"
      />
      <button
        type="button"
        className="text-teal-600 text-sm mt-2 mr-2 underline hover:text-teal-700"
        onClick={() => setShowLibrary(true)}
      >
        Choose from Library
      </button>
      {uploading && <p className="text-sm text-slate-500 mt-1">Uploading image…</p>}
      {imageUrl && (
        <div className="mt-2">
          <img src={imageUrl} alt="Featured" className="w-full max-w-md rounded-md" />
          <button
            type="button"
            className="text-red-600 mt-1 text-sm hover:underline"
            onClick={handleRemoveImage}
          >
            Remove image
          </button>
        </div>
      )}
      {/* Media Library Modal */}
      {showLibrary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl w-full relative">
            <button
              className="absolute top-2 right-2 text-slate-500 hover:text-slate-900 text-2xl"
              onClick={() => setShowLibrary(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="font-inter text-lg font-semibold text-slate-900 mb-4">Media Library</h2>
            <input
              type="text"
              placeholder="Search by filename..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 mb-4 text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/30"
            />
            {loadingLibrary ? (
              <p className="text-slate-600">Loading images…</p>
            ) : (
              <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {[...libraryImages]
                  .sort((a, b) => {
                    const aDate = a.last_modified ? new Date(a.last_modified).getTime() : 0;
                    const bDate = b.last_modified ? new Date(b.last_modified).getTime() : 0;
                    return bDate - aDate;
                  })
                  .filter(img => img.key.toLowerCase().includes(search.toLowerCase()))
                  .map(img => (
                    <button
                      key={img.key}
                      className="border border-slate-200 hover:border-teal-600 p-1 bg-slate-50 rounded-md"
                      onClick={() => {
                        onChange(img.url);
                        setShowLibrary(false);
                      }}
                    >
                      <img src={img.url} alt={img.key} className="w-full h-32 object-cover rounded" />
                      <div className="truncate text-xs mt-1 text-slate-600">{img.key.split('/').pop()}</div>
                    </button>
                  ))}
                {libraryImages.length === 0 && <p className="col-span-3 text-slate-400">No images found.</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
