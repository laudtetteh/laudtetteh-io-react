import React from 'react';
import { Editor, EditorContent } from '@tiptap/react';

interface PostContentEditorProps {
  editor: Editor | null;
  editorContent: { html: string };
  htmlMode: boolean;
  setHtmlMode: (mode: boolean) => void;
  errors: { [key: string]: string };
  setEditorContent: (content: { html: string }) => void;
}

const PostContentEditor: React.FC<PostContentEditorProps> = ({
  editor,
  editorContent,
  htmlMode,
  setHtmlMode,
  errors,
  setEditorContent,
}) => (
  <div>
    <label className="font-semibold">Content</label>
    <div className="border rounded overflow-hidden bg-white">
      <div className="flex flex-wrap gap-2 px-4 py-3 bg-blue-600 text-white border-b border-black shadow-md rounded-t">
        <button onClick={() => editor?.chain().focus().toggleBold().run()} type="button" className="btn">Bold</button>
        <button onClick={() => editor?.chain().focus().toggleItalic().run()} type="button" className="btn">Italic</button>
        <button onClick={() => editor?.chain().focus().toggleUnderline().run()} type="button" className="btn">Underline</button>
        <button onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} type="button" className="btn">H1</button>
        <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} type="button" className="btn">H2</button>
        <button onClick={() => editor?.chain().focus().toggleBulletList().run()} type="button" className="btn">• List</button>
        <button onClick={() => editor?.chain().focus().toggleOrderedList().run()} type="button" className="btn">1. List</button>
        <button onClick={() => editor?.chain().focus().toggleBlockquote().run()} type="button" className="btn">"" Quote</button>
        <button onClick={() => editor?.chain().focus().toggleCodeBlock().run()} type="button" className="btn">Code</button>
        <button onClick={() => editor?.chain().focus().setHorizontalRule().run()} type="button" className="btn">— HR</button>
        <button onClick={() => editor?.chain().focus().undo().run()} type="button" className="btn">↶ Undo</button>
        <button onClick={() => editor?.chain().focus().redo().run()} type="button" className="btn">↷ Redo</button>
        <button onClick={() => {
          setHtmlMode(!htmlMode);
        }} type="button" className="ml-auto btn">{htmlMode ? '👁 Visual' : '</> HTML'}</button>
      </div>
      {htmlMode ? (
        <textarea
          className="block w-full h-[400px] px-4 py-3 font-mono resize-y focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={editorContent.html}
          onChange={(e) => {
            const val = e.target.value;
            setEditorContent({ html: val });
            editor?.commands.setContent(val);
          }}
          rows={20}
        />
      ) : (
        <EditorContent editor={editor} className="editor-wrapper prose" />
      )}
    </div>
    {errors.content && <p className="text-red-600 text-sm">{errors.content}</p>}
  </div>
);

export default PostContentEditor;
