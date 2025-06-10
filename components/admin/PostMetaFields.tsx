import React from 'react';

interface PostMetaFieldsProps {
  title: string;
  slug: string;
  summary: string;
  errors: { [key: string]: string };
  onChange: (field: string, value: string) => void;
}

const PostMetaFields: React.FC<PostMetaFieldsProps> = ({ title, slug, summary, errors, onChange }) => (
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
      <input
        type="text"
        className="w-full border rounded px-3 py-2 lowercase"
        value={slug}
        onChange={(e) => onChange('slug', e.target.value.toLowerCase())}
      />
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
