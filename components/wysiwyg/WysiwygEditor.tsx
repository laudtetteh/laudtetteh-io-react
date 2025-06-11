/**
 * WysiwygEditor
 * A modular rich text editor with visual and HTML modes, toolbar, and character count.
 */
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { Placeholder } from '@tiptap/extension-placeholder';
import { CharacterCount } from '@tiptap/extension-character-count';
import { Underline } from '@tiptap/extension-underline';
import { Extension } from '@tiptap/core';
import { Plugin } from 'prosemirror-state';
import { generateJSON } from '@tiptap/html';

import WysiwygToolbar from './WysiwygToolbar';
import WysiwygVisualEditor from './WysiwygVisualEditor';
import WysiwygHtmlEditor from './WysiwygHtmlEditor';
import WysiwygCharacterCount from './WysiwygCharacterCount';

/**
 * Props for WysiwygEditor
 */
export interface WysiwygEditorProps {
  content: string | { html: string };
  onChange: (html: string) => void;
  limit?: number;
}

export default function WysiwygEditor({ content, onChange, limit = 5000 }: WysiwygEditorProps) {
  const [mode, setMode] = useState<'visual' | 'html'>('visual');
  const [isClient, setIsClient] = useState(false);
  const [localContent, setLocalContent] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Helper: get Tiptap-compatible content (JSON or HTML)
  const getTiptapContent = useCallback(
    (rawContent: string | { html: string }) => {
      if (typeof rawContent === 'object' && rawContent !== null && 'html' in rawContent) {
        // Convert HTML to Tiptap JSON
        return generateJSON(rawContent.html, [
          StarterKit,
          Underline,
          Image.configure({ inline: true, allowBase64: true }),
          Link.configure({ openOnClick: false }),
          Placeholder.configure({ placeholder: 'Write your post content here...' }),
          CharacterCount.configure({ limit }),
        ]);
      }
      return rawContent || '';
    },
    [limit],
  );

  const editor = useEditor({
    content: getTiptapContent(content),
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
                  for (const item of items) {
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
                  for (const file of files) {
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
      editor.commands.setContent(getTiptapContent(content));
    }
  }, [editor, content, getTiptapContent]);

  // Push localContent upstream only when user submits form
  useEffect(() => {
    onChange(localContent);
  }, [localContent, onChange]);

  if (!editor || !isClient) return null;

  return (
    <div className="overflow-hidden rounded border bg-white">
      <div className="flex items-center justify-between border-b bg-gray-100 px-4 py-2">
        <WysiwygToolbar
          editor={editor}
          htmlMode={mode === 'html'}
          setHtmlMode={(val) => setMode(val ? 'html' : 'visual')}
        />
      </div>
      {mode === 'visual' ? (
        <WysiwygVisualEditor editor={editor} />
      ) : (
        <WysiwygHtmlEditor
          value={localContent}
          onChange={(val) => {
            setLocalContent(val);
            editor?.commands.setContent(val);
          }}
        />
      )}
      <WysiwygCharacterCount current={editor.storage.characterCount.characters()} limit={limit} />
    </div>
  );
}
