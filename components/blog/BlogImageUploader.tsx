/**
 * BlogImageUploader
 * Handles image file selection and upload for a blog post.
 */
import React from 'react';

export interface BlogImageUploaderProps {
  uploading: boolean;
  onImageChange: (file: File | null) => void;
  onUpload: () => void;
  disabled: boolean;
}

const BlogImageUploader: React.FC<BlogImageUploaderProps> = ({ uploading, onImageChange, onUpload, disabled }) => (
  <div className="flex gap-4 items-center">
    <input
      type="file"
      accept="image/*"
      onChange={e => onImageChange(e.target.files?.[0] || null)}
    />
    <button
      type="button"
      onClick={onUpload}
      disabled={uploading || disabled}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      {uploading ? "Uploading..." : "Upload Image"}
    </button>
  </div>
);

export default BlogImageUploader;
