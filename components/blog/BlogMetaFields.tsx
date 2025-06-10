/**
 * BlogMetaFields
 * Renders the title, slug, and summary fields for a blog post form.
 */
import React from 'react';

export interface BlogMetaFieldsProps {
  title: string;
  slug: string;
  summary: string;
  isEditing: boolean;
  onChange: (field: string, value: string) => void;
}

const BlogMetaFields: React.FC<BlogMetaFieldsProps> = ({ title, slug, summary, isEditing, onChange }) => (
  <>
    <input
      className="w-full p-2 border"
      name="title"
      placeholder="Title"
      value={title}
      onChange={e => onChange('title', e.target.value)}
    />
    <input
      className="w-full p-2 border"
      name="slug"
      placeholder="Slug"
      value={slug}
      onChange={e => onChange('slug', e.target.value)}
      disabled={isEditing}
    />
    <textarea
      className="w-full p-2 border"
      name="summary"
      placeholder="Summary"
      rows={2}
      value={summary}
      onChange={e => onChange('summary', e.target.value)}
    />
  </>
);

export default BlogMetaFields;
