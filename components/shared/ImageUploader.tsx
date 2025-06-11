'use client';

import { useState } from 'react';
import Image from 'next/image';

import { uploadImage } from '@/lib/api';

interface ImageUploaderProps {
  imageUrl?: string;
  onChange: (url: string) => void;
}

export default function ImageUploader({ imageUrl, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [inputKey, setInputKey] = useState(Date.now());

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const token = localStorage.getItem('token') || '';
    try {
      const file_url = await uploadImage(file, token);
      onChange(file_url);
    } catch (error: unknown) {
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
      <label className="font-semibold" htmlFor="featured-image-input">
        Featured Image
      </label>
      <input
        id="featured-image-input"
        key={inputKey}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mt-1 block"
      />
      {uploading && <p className="mt-1 text-sm text-gray-500">Uploading image…</p>}
      {imageUrl && (
        <div className="mt-2">
          <Image
            src={imageUrl}
            alt="Uploaded"
            width={500}
            height={200}
            className="h-32 w-full object-cover"
          />
          <button
            type="button"
            className="mt-1 text-sm text-red-500 hover:underline"
            onClick={handleRemoveImage}
          >
            Remove image
          </button>
        </div>
      )}
    </div>
  );
}
