'use client';

import { Editor } from '@tiptap/react';

export default function WysiwygToolbar({
  editor,
  htmlMode,
  setHtmlMode,
}: {
  editor: Editor;
  htmlMode: boolean;
  setHtmlMode: (val: boolean) => void;
}) {
  if (!editor) return null;

  return (
    <div className="flex w-full flex-wrap gap-2 border-b border-gray-300 bg-gray-100 px-3 py-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`rounded px-2 py-1 text-sm ${editor.isActive('bold') ? 'bg-blue-100 text-blue-800' : ''}`}
      >
        <strong>B</strong>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`rounded px-2 py-1 text-sm ${editor.isActive('italic') ? 'bg-blue-100 text-blue-800' : ''}`}
      >
        <em>I</em>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`rounded px-2 py-1 text-sm ${editor.isActive('underline') ? 'bg-blue-100 text-blue-800' : ''}`}
      >
        <u>U</u>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`rounded px-2 py-1 text-sm ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-800' : ''}`}
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`rounded px-2 py-1 text-sm ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-800' : ''}`}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`rounded px-2 py-1 text-sm ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-800' : ''}`}
      >
        • List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`rounded px-2 py-1 text-sm ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-800' : ''}`}
      >
        1. List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`rounded px-2 py-1 text-sm ${editor.isActive('blockquote') ? 'bg-blue-100 text-blue-800' : ''}`}
      >
        “ Quote ”
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`rounded px-2 py-1 text-sm ${editor.isActive('codeBlock') ? 'bg-blue-100 text-blue-800' : ''}`}
      >
        Code
      </button>
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="rounded px-2 py-1 text-sm"
      >
        — HR
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className="rounded px-2 py-1 text-sm"
      >
        ↶ Undo
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        className="rounded px-2 py-1 text-sm"
      >
        ↷ Redo
      </button>
      <button
        onClick={() => setHtmlMode(!htmlMode)}
        className={`ml-auto rounded px-2 py-1 text-sm ${htmlMode ? 'bg-blue-200 text-blue-900' : ''}`}
      >
        {htmlMode ? '👁 Visual' : '</> HTML'}
      </button>
    </div>
  );
}
