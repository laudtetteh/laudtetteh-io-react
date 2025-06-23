import React from 'react';

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
      <label className="font-semibold">Title</label>
      <input
        type="text"
        className="w-full border rounded px-3 py-2"
        value={title}
        onChange={(e) => onChange('title', e.target.value)}
      />
      {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}
    </div>
    <div>
      <label className="font-semibold">Slug</label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="w-full border rounded px-3 py-2 lowercase"
          value={slug}
          onChange={(e) => onChange('slug', e.target.value.toLowerCase())}
          readOnly={slugReadOnly}
        />
        {slugReadOnly && (
          <button type="button" className="text-xs px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200" onClick={onSlugEditClick}>
            Edit
          </button>
        )}
      </div>
      {errors.slug && <p className="text-red-600 text-sm">{errors.slug}</p>}
    </div>
    <div>
      <label className="font-semibold">Summary</label>
      <textarea
        rows={3}
        className="w-full border rounded px-3 py-2"
        value={summary}
        onChange={(e) => onChange('summary', e.target.value)}
      />
      {errors.summary && <p className="text-red-600 text-sm">{errors.summary}</p>}
    </div>
  </>
);

export default PostMetaFields;
