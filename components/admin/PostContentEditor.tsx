import React from 'react';
import { Editor, EditorContent } from '@tiptap/react';
import { labelClasses } from './adminStyles';

interface PostContentEditorProps {
  editor: Editor | null;
  editorContent: { html: string };
  htmlMode: boolean;
  setHtmlMode: (mode: boolean) => void;
  errors: { [key: string]: string };
  setEditorContent: (content: { html: string }) => void;
}

const toolbarButtonClasses =
  'rounded-md px-2.5 py-1 text-sm font-medium text-slate-100 hover:bg-white/10';

const PostContentEditor: React.FC<PostContentEditorProps> = ({
  editor,
  editorContent,
  htmlMode,
  setHtmlMode,
  errors,
  setEditorContent,
}) => (
  <div>
    <label className={labelClasses}>Content</label>
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <div className="flex flex-wrap gap-1 border-b border-slate-800 bg-slate-900 px-3 py-2">
        <button onClick={() => editor?.chain().focus().toggleBold().run()} type="button" className={toolbarButtonClasses}>Bold</button>
        <button onClick={() => editor?.chain().focus().toggleItalic().run()} type="button" className={toolbarButtonClasses}>Italic</button>
        <button onClick={() => editor?.chain().focus().toggleUnderline().run()} type="button" className={toolbarButtonClasses}>Underline</button>
        <button onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} type="button" className={toolbarButtonClasses}>H1</button>
        <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} type="button" className={toolbarButtonClasses}>H2</button>
        <button onClick={() => editor?.chain().focus().toggleBulletList().run()} type="button" className={toolbarButtonClasses}>• List</button>
        <button onClick={() => editor?.chain().focus().toggleOrderedList().run()} type="button" className={toolbarButtonClasses}>1. List</button>
        <button onClick={() => editor?.chain().focus().toggleBlockquote().run()} type="button" className={toolbarButtonClasses}>&quot;&quot; Quote</button>
        <button onClick={() => editor?.chain().focus().toggleCodeBlock().run()} type="button" className={toolbarButtonClasses}>Code</button>
        <button onClick={() => editor?.chain().focus().setHorizontalRule().run()} type="button" className={toolbarButtonClasses}>— HR</button>
        <button onClick={() => editor?.chain().focus().undo().run()} type="button" className={toolbarButtonClasses}>↶ Undo</button>
        <button onClick={() => editor?.chain().focus().redo().run()} type="button" className={toolbarButtonClasses}>↷ Redo</button>
        <button onClick={() => {
          setHtmlMode(!htmlMode);
        }} type="button" className={`${toolbarButtonClasses} ml-auto`}>{htmlMode ? 'Visual' : '</> HTML'}</button>
      </div>
      {htmlMode ? (
        <textarea
          className="block w-full h-[400px] px-4 py-3 font-mono text-slate-900 resize-y focus:outline-none focus:ring-2 focus:ring-teal-600/30"
          value={editorContent.html}
          onChange={(e) => {
            const val = e.target.value;
            setEditorContent({ html: val });
            editor?.commands.setContent(val);
          }}
          rows={20}
        />
      ) : (
        <EditorContent editor={editor} className="editor-wrapper prose px-4 py-3" />
      )}
    </div>
    {errors.content && <p className="text-red-600 text-sm mt-1">{errors.content}</p>}
  </div>
);

export default PostContentEditor;
