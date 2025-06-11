/**
 * BlogPreview
 * Displays a preview of the blog post.
 */
import React from 'react';

export interface BlogPreviewProps {
  title: string;
  summary: string;
  content: { html: string };
}

const BlogPreview: React.FC<BlogPreviewProps> = ({ title, summary, content }) => (
  <div className="border bg-white p-4">
    <h3 className="mb-2 text-xl font-bold">{title}</h3>
    <p className="text-sm text-gray-500">{summary}</p>
    <div className="prose mt-4 max-w-none" dangerouslySetInnerHTML={{ __html: content.html }} />
  </div>
);

export default BlogPreview;
