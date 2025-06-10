/**
 * BlogContentEditor
 * Renders the content textarea for a blog post form.
 */
import React from 'react';

export interface BlogContentEditorProps {
  content: string;
  onChange: (value: string) => void;
}

const BlogContentEditor: React.FC<BlogContentEditorProps> = ({ content, onChange }) => (
  <textarea
    className="w-full p-2 border"
    name="content"
    placeholder="HTML Content"
    rows={10}
    value={content}
    onChange={e => onChange(e.target.value)}
  />
);

export default BlogContentEditor;
