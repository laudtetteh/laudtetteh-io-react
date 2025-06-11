import React from 'react';

interface PostActionsProps {
  isEdit: boolean;
}

const PostActions: React.FC<PostActionsProps> = ({ isEdit }) => (
  <div className="flex justify-end">
    <button
      type="submit"
      className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
    >
      {isEdit ? 'Update Post' : 'Create Post'}
    </button>
  </div>
);

export default PostActions;
