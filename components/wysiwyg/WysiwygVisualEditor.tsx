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
    className={className || 'prose min-h-[400px] max-w-none px-4 py-6 focus:outline-none'}
  />
);

export default WysiwygVisualEditor;
