'use client';

import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Underline from '@tiptap/extension-underline';
import { Extension } from '@tiptap/core';
import { Plugin } from 'prosemirror-state';
import WysiwygToolbar from './WysiwygToolbar';

interface Props {
  content: string;
  onChange: (html: string) => void;
  limit?: number;
}

export default function WysiwygEditor({ content, onChange, limit = 5000 }: Props) {
  const [mode, setMode] = useState<'visual' | 'html'>('visual');
  const [isClient, setIsClient] = useState(false);
  const [localContent, setLocalContent] = useState(content);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useEditor({
    content,
    editable: true,
    extensions: [
      StarterKit.configure(),
      Underline,
      Image.configure({ inline: true, allowBase64: true }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Write your post content here...' }),
      CharacterCount.configure({ limit }),
      Extension.create({
        name: 'imagePasteHandler',
        addProseMirrorPlugins() {
          return [
            new Plugin({
              props: {
                handlePaste(view, event) {
                  const items = event.clipboardData?.items || [];
                  for (let item of items) {
                    if (item.type.indexOf('image') === 0) {
                      const file = item.getAsFile();
                      if (file) {
                        uploadAndInsert(file);
                        return true;
                      }
                    }
                  }
                  return false;
                },
                handleDrop(view, event) {
                  const files = event.dataTransfer?.files || [];
                  for (let file of files) {
                    if (file.type.startsWith('image/')) {
                      uploadAndInsert(file);
                      return true;
                    }
                  }
                  return false;
                },
              },
            }),
          ];
        },
      }),
    ],
    onUpdate({ editor }) {
      const html = editor.getHTML();
      setLocalContent(html); // only local update
    },
  });

  async function uploadAndInsert(file: File) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/upload-url`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ filename: file.name, contentType: file.type }),
    });

    if (!res.ok) {
      alert('Image upload failed');
      return;
    }

    const { upload_url, file_url } = await res.json();
    await fetch(upload_url, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });

    editor?.chain().focus().setImage({ src: file_url }).run();
  }

  // Hydrate initial content only once
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [editor, content]);

  // Push localContent upstream only when user submits form
  useEffect(() => {
    onChange(localContent);
  }, [localContent]); // only if you want a sync

  if (!editor || !isClient) return null;

  return (
    <div className="border rounded overflow-hidden bg-white">
      <div className="flex justify-between items-center px-4 py-2 border-b bg-gray-100">
        <WysiwygToolbar
          editor={editor}
          htmlMode={mode === 'html'}
          setHtmlMode={(val) => setMode(val ? 'html' : 'visual')}
        />
      </div>

      {mode === 'visual' ? (
        <EditorContent
          editor={editor}
          className="px-4 py-6 min-h-[400px] prose max-w-none focus:outline-none"
        />
      ) : (
        <textarea
          className="w-full h-[400px] px-4 py-3 font-mono border-t focus:outline-none"
          value={localContent}
          onChange={(e) => {
            const val = e.target.value;
            setLocalContent(val);
            editor?.commands.setContent(val);
          }}
        />
      )}

      <div className="text-sm text-right text-gray-500 px-4 pb-2">
        {editor.storage.characterCount.characters()} / {limit} characters
      </div>
    </div>
  );
}
