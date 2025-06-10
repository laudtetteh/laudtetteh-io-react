import React from 'react';
import CategoryPicker from '../CategoryPicker';

interface PostOptionsProps {
  categories: string[];
  status: 'draft' | 'published';
  featured: boolean;
  weight: number;
  onChange: (field: string, value: any) => void;
}

const PostOptions: React.FC<PostOptionsProps> = ({
  categories,
  status,
  featured,
  weight,
  onChange,
}) => (
  <>
    <CategoryPicker
      selected={categories}
      onChange={(cats) => onChange('categories', cats)}
    />
    <div className="flex items-center gap-4 flex-wrap">
      <label className="font-semibold">Status</label>
      <select
        value={status}
        onChange={(e) => onChange('status', e.target.value as 'draft' | 'published')}
        className="border rounded px-3 py-2"
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => onChange('featured', e.target.checked)}
        />
        Featured Post
      </label>
      <label className="flex items-center gap-2">
        <span className="font-semibold">Weight</span>
        <input
          type="number"
          className="border rounded px-2 py-1 w-20"
          value={weight || 0}
          onChange={(e) => onChange('weight', Number(e.target.value))}
        />
      </label>
    </div>
  </>
);

export default PostOptions;
