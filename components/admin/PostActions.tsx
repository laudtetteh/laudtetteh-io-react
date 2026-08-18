import React from 'react';
import { primaryButtonClasses, secondaryButtonClasses, dangerButtonClasses } from './adminStyles';

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
        className={secondaryButtonClasses}
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
        className={dangerButtonClasses}
      >
        Delete
      </button>
    )}
    <button
      type="submit"
      className={primaryButtonClasses}
    >
      {isEdit ? 'Update Post' : 'Create Post'}
    </button>
  </div>
);

export default PostActions;
