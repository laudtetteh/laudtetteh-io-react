'use client';

import { useState, useEffect } from 'react';
import { useFlashMessage } from '@/lib/useFlashMessage';
import { uploadImage } from '@/lib/api';

interface ImageUploaderProps {
  imageUrl?: string;
  onChange: (url: string) => void;
}

export default function ImageUploader({ imageUrl, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [inputKey, setInputKey] = useState(Date.now());
  const { pushMessage, confirmPrompt } = useFlashMessage();

  // Media library modal state
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryImages, setLibraryImages] = useState<{ url: string; key: string }[]>([]);
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
    } catch (error: any) {
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
      <label className="font-semibold">Featured Image</label>
      <input
        key={inputKey}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="block mt-1"
      />
      <button
        type="button"
        className="text-blue-600 text-sm mt-2 mr-2 underline"
        onClick={() => setShowLibrary(true)}
      >
        Choose from Library
      </button>
      {uploading && <p className="text-sm text-gray-500 mt-1">Uploading image…</p>}
      {imageUrl && (
        <div className="mt-2">
          <img src={imageUrl} alt="Featured" className="w-full max-w-md rounded" />
          <button
            type="button"
            className="text-red-500 mt-1 text-sm hover:underline"
            onClick={handleRemoveImage}
          >
            Remove image
          </button>
        </div>
      )}
      {/* Media Library Modal */}
      {showLibrary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-lg max-w-2xl w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
              onClick={() => setShowLibrary(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-lg font-bold mb-4">Media Library</h2>
            <input
              type="text"
              placeholder="Search by filename..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border px-3 py-2 mb-4 w-full rounded"
            />
            {loadingLibrary ? (
              <p>Loading images…</p>
            ) : (
              <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {libraryImages
                  .filter(img => img.key.toLowerCase().includes(search.toLowerCase()))
                  .map(img => (
                    <button
                      key={img.key}
                      className="border hover:border-blue-500 p-1 bg-gray-50"
                      onClick={() => {
                        onChange(img.url);
                        setShowLibrary(false);
                      }}
                    >
                      <img src={img.url} alt={img.key} className="w-full h-32 object-cover" />
                      <div className="truncate text-xs mt-1">{img.key.split('/').pop()}</div>
                    </button>
                  ))}
                {libraryImages.length === 0 && <p className="col-span-3 text-gray-400">No images found.</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
