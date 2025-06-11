/**
 * BlogContentEditor
 * Renders the content textarea for a blog post form.
 */
import React from 'react';

export interface BlogContentEditorProps {
  content: { html: string };
  onChange: (value: { html: string }) => void;
}

const BlogContentEditor: React.FC<BlogContentEditorProps> = ({ content, onChange }) => (
  <textarea
    className="w-full border p-2"
    name="content"
    placeholder="HTML Content"
    rows={10}
    value={content.html}
    onChange={(e) => onChange({ html: e.target.value })}
  />
);

export default BlogContentEditor;
