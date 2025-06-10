/**
 * WysiwygVisualEditor
 * Renders the ProseMirror visual editor for rich text content.
 */
import React from 'react';
import { Editor, EditorContent } from '@tiptap/react';

export interface WysiwygVisualEditorProps {
  editor: Editor;
  className?: string;
}

const WysiwygVisualEditor: React.FC<WysiwygVisualEditorProps> = ({ editor, className }) => (
  <EditorContent
    editor={editor}
    className={className || 'px-4 py-6 min-h-[400px] prose max-w-none focus:outline-none'}
  />
);

export default WysiwygVisualEditor;