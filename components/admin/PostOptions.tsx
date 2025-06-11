import React from 'react';

import CategoryPicker from '../CategoryPicker';

interface PostOptionsProps {
  categories: string[];
  status: 'draft' | 'published';
  featured: boolean;
  weight: number;
  onChange: (field: string, value: string | boolean | number | string[]) => void;
}

const PostOptions: React.FC<PostOptionsProps> = ({
  categories,
  status,
  featured,
  weight,
  onChange,
}) => (
  <>
    <CategoryPicker selected={categories} onChange={(cats) => onChange('categories', cats)} />
    <div className="flex flex-wrap items-center gap-4">
      <label className="font-semibold" htmlFor="post-status">
        Status
      </label>
      <select
        id="post-status"
        value={status}
        onChange={(e) => onChange('status', e.target.value as 'draft' | 'published')}
        className="rounded border px-3 py-2"
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>
      <label className="flex items-center gap-2" htmlFor="post-featured">
        <input
          id="post-featured"
          type="checkbox"
          checked={featured}
          onChange={(e) => onChange('featured', e.target.checked)}
        />
        Featured Post
      </label>
      <label className="flex items-center gap-2" htmlFor="post-weight">
        <span className="font-semibold">Weight</span>
        <input
          id="post-weight"
          type="number"
          className="w-20 rounded border px-2 py-1"
          value={weight || 0}
          onChange={(e) => onChange('weight', Number(e.target.value))}
        />
      </label>
    </div>
  </>
);

export default PostOptions;
