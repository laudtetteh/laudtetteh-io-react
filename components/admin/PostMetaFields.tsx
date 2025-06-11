import React from 'react';

interface PostMetaFieldsProps {
  title: string;
  slug: string;
  summary: string;
  errors: { [key: string]: string };
  onChange: (field: string, value: string) => void;
}

const PostMetaFields: React.FC<PostMetaFieldsProps> = ({
  title,
  slug,
  summary,
  errors,
  onChange,
}) => (
  <>
    <div>
      <label className="font-semibold" htmlFor="post-title">
        Title
      </label>
      <input
        id="post-title"
        type="text"
        className="w-full rounded border px-3 py-2"
        value={title}
        onChange={(e) => onChange('title', e.target.value)}
      />
      {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
    </div>
    <div>
      <label className="font-semibold" htmlFor="post-slug">
        Slug
      </label>
      <input
        id="post-slug"
        type="text"
        className="w-full rounded border px-3 py-2 lowercase"
        value={slug}
        onChange={(e) => onChange('slug', e.target.value.toLowerCase())}
      />
      {errors.slug && <p className="text-sm text-red-600">{errors.slug}</p>}
    </div>
    <div>
      <label className="font-semibold" htmlFor="post-summary">
        Summary
      </label>
      <textarea
        id="post-summary"
        rows={3}
        className="w-full rounded border px-3 py-2"
        value={summary}
        onChange={(e) => onChange('summary', e.target.value)}
      />
      {errors.summary && <p className="text-sm text-red-600">{errors.summary}</p>}
    </div>
  </>
);

export default PostMetaFields;
