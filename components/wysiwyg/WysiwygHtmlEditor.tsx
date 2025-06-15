/**
 * WysiwygHtmlEditor
 * Renders a textarea for editing HTML content directly.
 */
import React from 'react';

export interface WysiwygHtmlEditorProps {
  value: { html: string };
  onChange: (value: { html: string }) => void;
  className?: string;
}

const WysiwygHtmlEditor: React.FC<WysiwygHtmlEditorProps> = ({ value, onChange, className }) => (
  <textarea
    className={className || 'w-full h-[400px] px-4 py-3 font-mono border-t focus:outline-none'}
    value={value.html}
    onChange={e => onChange({ html: e.target.value })}
  />
);

export default WysiwygHtmlEditor;
