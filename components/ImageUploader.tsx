'use client';

import { useState } from 'react';
import { useFlashMessage } from '@/hooks/useFlashMessage';

interface ImageUploaderProps {
  imageUrl?: string;
  onChange: (url: string) => void;
}

export default function ImageUploader({ imageUrl, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [inputKey, setInputKey] = useState(Date.now());
  const { pushMessage, confirmPrompt } = useFlashMessage();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/upload-url`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: file.name,
          content_type: file.type,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.detail || 'Failed to get upload URL');
      }

      const { upload_url, file_url } = await res.json();

      await fetch(upload_url, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      onChange(file_url);
    } catch (error: any) {
      console.error('❌ Upload error:', error);
      // pushMessage(error.message || 'Image upload failed.', 'top-center', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    // Replace this with your modal logic later
    // const confirmed = await confirmPrompt('Remove the image?');
    const confirmed = window.confirm('Remove the image?');
    if (confirmed) {
      onChange('');
      setInputKey(Date.now());
      // pushMessage('Image removed.', 'top-center', 'success');
    }
  };

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
    </div>
  );
}
