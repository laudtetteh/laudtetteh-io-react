'use client';

import { useState } from 'react';
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
