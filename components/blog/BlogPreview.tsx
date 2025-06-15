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
  <div className="border p-4 bg-white">
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-sm text-gray-500">{summary}</p>
    <div
      className="mt-4 prose max-w-none"
      dangerouslySetInnerHTML={{ __html: content.html }}
    />
  </div>
);

export default BlogPreview;
