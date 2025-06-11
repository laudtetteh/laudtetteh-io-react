/**
 * WysiwygHtmlEditor
 * Renders a textarea for editing HTML content directly.
 */
import React from 'react';

export interface WysiwygHtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const WysiwygHtmlEditor: React.FC<WysiwygHtmlEditorProps> = ({ value, onChange, className }) => (
  <textarea
    className={className || 'h-[400px] w-full border-t px-4 py-3 font-mono focus:outline-none'}
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

export default WysiwygHtmlEditor;
