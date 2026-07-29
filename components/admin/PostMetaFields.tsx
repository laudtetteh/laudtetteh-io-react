import React from 'react';
import { inputClasses, labelClasses } from './adminStyles';

interface PostMetaFieldsProps {
  title: string;
  slug: string;
  summary: string;
  errors: { [key: string]: string };
  onChange: (field: string, value: string) => void;
  slugReadOnly?: boolean;
  onSlugEditClick?: () => void;
}

const PostMetaFields: React.FC<PostMetaFieldsProps> = ({ title, slug, summary, errors, onChange, slugReadOnly = false, onSlugEditClick }) => (
  <>
    <div>
      <label className={labelClasses}>Title</label>
      <input
        type="text"
        className={inputClasses}
        value={title}
        onChange={(e) => onChange('title', e.target.value)}
      />
      {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
    </div>
    <div>
      <label className={labelClasses}>Slug</label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          className={`${inputClasses} lowercase`}
          value={slug}
          onChange={(e) => onChange('slug', e.target.value.toLowerCase())}
          readOnly={slugReadOnly}
        />
        {slugReadOnly && (
          <button type="button" className="shrink-0 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50" onClick={onSlugEditClick}>
            Edit
          </button>
        )}
      </div>
      {errors.slug && <p className="text-red-600 text-sm mt-1">{errors.slug}</p>}
    </div>
    <div>
      <label className={labelClasses}>Summary</label>
      <textarea
        rows={3}
        className={inputClasses}
        value={summary}
        onChange={(e) => onChange('summary', e.target.value)}
      />
      {errors.summary && <p className="text-red-600 text-sm mt-1">{errors.summary}</p>}
    </div>
  </>
);

export default PostMetaFields;
