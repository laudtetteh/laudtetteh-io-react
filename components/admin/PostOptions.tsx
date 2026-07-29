import React from 'react';
import CategoryPicker from '../CategoryPicker';
import { formatInTimeZone } from 'date-fns-tz';
import { labelClasses } from './adminStyles';

interface PostOptionsProps {
  categories: string[];
  status: 'draft' | 'published';
  featured: boolean;
  weight: number;
  date_published?: string;
  onChange: (field: string, value: string | string[] | boolean | number) => void;
}

const PostOptions: React.FC<PostOptionsProps> = ({
  categories,
  status,
  featured,
  weight,
  date_published,
  onChange,
}) => {
  const ptDateString = date_published
    ? formatInTimeZone(new Date(date_published), 'America/Los_Angeles', "yyyy-MM-dd'T'HH:mm")
    : '';

  return (
    <>
      <CategoryPicker
        selected={categories}
        onChange={(cats) => onChange('categories', cats)}
      />
      <div className="flex items-center gap-4 flex-wrap">
        <label className={labelClasses}>Status</label>
        <select
          value={status}
          onChange={(e) => onChange('status', e.target.value as 'draft' | 'published')}
          className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <label className="flex items-center gap-2">
          <span className={labelClasses}>Published Date</span>
          <input
            type="datetime-local"
            className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-slate-900"
            value={ptDateString}
            onChange={(e) => onChange('date_published', e.target.value)}
          />
        </label>

        <label className="flex items-center gap-2 text-slate-900">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => onChange('featured', e.target.checked)}
            className="accent-teal-600"
          />
          Featured Post
        </label>
        <label className="flex items-center gap-2">
          <span className={labelClasses}>Weight</span>
          <input
            type="number"
            className="w-20 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-slate-900"
            value={weight || 0}
            onChange={(e) => onChange('weight', Number(e.target.value))}
          />
        </label>
      </div>
    </>
  );
};

export default PostOptions;
