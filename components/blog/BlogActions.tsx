/**
 * BlogActions
 * Renders the submit and preview buttons for a blog post form.
 */
import React from 'react';

export interface BlogActionsProps {
  isEditing: boolean;
  preview: boolean;
  onPreviewToggle: () => void;
}

const BlogActions: React.FC<BlogActionsProps> = ({ isEditing, preview, onPreviewToggle }) => (
  <div className="flex gap-4">
    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
      {isEditing ? "Update Post" : "Publish Post"}
    </button>
    <button
      type="button"
      onClick={onPreviewToggle}
      className="px-4 py-2 bg-gray-300 rounded"
    >
      {preview ? "Edit Mode" : "Preview"}
    </button>
  </div>
);

export default BlogActions;
