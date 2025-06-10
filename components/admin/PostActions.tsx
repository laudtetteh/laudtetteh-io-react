import React from 'react';

interface PostActionsProps {
  isEdit: boolean;
}

const PostActions: React.FC<PostActionsProps> = ({ isEdit }) => (
  <div className="flex justify-end">
    <button
      type="submit"
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      {isEdit ? 'Update Post' : 'Create Post'}
    </button>
  </div>
);

export default PostActions;
