import React from 'react';

interface PostActionsProps {
  isEdit: boolean;
  slug?: string;
  onDelete?: () => void;
}

const PostActions: React.FC<PostActionsProps> = ({ isEdit, slug, onDelete }) => (
  <div className="flex justify-end space-x-3">
    {isEdit && slug && (
      <a
        href={`/blog/${slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition border border-gray-300"
      >
        View
      </a>
    )}
    {isEdit && onDelete && (
      <button
        type="button"
        onClick={() => {
          if (window.confirm('Are you sure you want to delete this post?')) onDelete();
        }}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Delete
      </button>
    )}
    <button
      type="submit"
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      {isEdit ? 'Update Post' : 'Create Post'}
    </button>
  </div>
);

export default PostActions;
