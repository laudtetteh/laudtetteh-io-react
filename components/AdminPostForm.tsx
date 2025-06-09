'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useFlashMessage } from '@/hooks/useFlashMessage';
import CategoryPicker from './CategoryPicker';
import ImageUploader from './ImageUploader';
import {
  useEditor,
  EditorContent,
  Editor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { Extension } from '@tiptap/core';
import { Plugin } from 'prosemirror-state';

interface PostData {
  title: string;
  slug: string;
  summary: string;
  content: string;
  categories: string[];
  status: 'draft' | 'published';
  featured: boolean;
  featuredImage?: string;
  weight?: number;
}

export default function AdminPostForm({
  initialData,
  onSubmit,
  isEdit = false,
}: {
  initialData?: Partial<PostData>;
  onSubmit: (data: PostData) => void;
  isEdit?: boolean;
}) {
  const router = useRouter();
  const { pushMessage } = useFlashMessage();

  const [formData, setFormData] = useState<PostData | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [htmlMode, setHtmlMode] = useState(false);
  const [editorContent, setEditorContent] = useState('');

  useEffect(() => {
    if (initialData) {
      const fullData: PostData = {
        title: initialData.title || '',
        slug: initialData.slug || '',
        summary: initialData.summary || '',
        content: initialData.content || '',
        categories: initialData.categories || [],
        status: initialData.status || 'draft',
        featured: initialData.featured || false,
        featuredImage: initialData.featuredImage || '',
        weight: initialData.weight ?? 0,
      };
      setFormData(fullData);
      setEditorContent(fullData.content);
    } else {
      setFormData({
        title: '',
        slug: '',
        summary: '',
        content: '',
        categories: [],
        status: 'draft',
        featured: false,
        featuredImage: '',
        weight: 0,
      });
      setEditorContent('');
    }
  }, [initialData]);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData?.title.trim()) errs.title = 'Title is required';
    if (!formData?.slug.trim()) errs.slug = 'Slug is required';
    if (!/^[a-z0-9-]+$/.test(formData?.slug || '')) errs.slug = 'Slug must be lowercase letters, numbers, or hyphens only';
    if (!formData?.summary.trim()) errs.summary = 'Summary is required';
    if (!editorContent.trim()) errs.content = 'Content is required';
    return errs;
  };

  const editor = useEditor({
    content: editorContent,
    extensions: [
      StarterKit.configure(),
      Underline,
      Image.configure({ inline: true, allowBase64: true }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Write your post content here...' }),
      CharacterCount.configure({ limit: 5000 }),
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
      setEditorContent(html);
    },
  });

  useEffect(() => {
    if (editor && formData) {
      editor.commands.setContent(formData.content || '');
    }
  }, [editor, formData]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updated = {
      ...formData,
      content: editorContent,
      categories: formData.categories.length > 0 ? formData.categories : ['uncategorized'],
    };

    if (!isEdit) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/posts/${updated.slug}`);
      if (res.ok) {
        pushMessage('Slug already exists. Please choose a unique one.', 'top-center', 'error');
        return;
      }
    }

    onSubmit(updated);
  };

  if (!formData) return <p className="text-center py-10">Loading form...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto py-10">
      {/* Title, Slug, Summary */}
      <div>
        <label className="font-semibold">Title</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}
      </div>

      <div>
        <label className="font-semibold">Slug</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 lowercase"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
        />
        {errors.slug && <p className="text-red-600 text-sm">{errors.slug}</p>}
      </div>

      <div>
        <label className="font-semibold">Summary</label>
        <textarea
          rows={3}
          className="w-full border rounded px-3 py-2"
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
        />
        {errors.summary && <p className="text-red-600 text-sm">{errors.summary}</p>}
      </div>

      {/* Content Editor */}
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
            <button onClick={() => editor?.chain().focus().toggleBlockquote().run()} type="button" className="btn">“” Quote</button>
            <button onClick={() => editor?.chain().focus().toggleCodeBlock().run()} type="button" className="btn">Code</button>
            <button onClick={() => editor?.chain().focus().setHorizontalRule().run()} type="button" className="btn">— HR</button>
            <button onClick={() => editor?.chain().focus().undo().run()} type="button" className="btn">↶ Undo</button>
            <button onClick={() => editor?.chain().focus().redo().run()} type="button" className="btn">↷ Redo</button>
            <button onClick={() => setHtmlMode(!htmlMode)} type="button" className="ml-auto btn">{htmlMode ? '👁 Visual' : '</> HTML'}</button>
          </div>

          {htmlMode ? (
            <textarea
              className="block w-full h-[400px] px-4 py-3 font-mono resize-y focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={editorContent}
              onChange={(e) => {
                const val = e.target.value;
                setEditorContent(val);
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

      {/* Categories, Status, Featured, Weight */}
      <CategoryPicker
        selected={formData.categories}
        onChange={(categories) => setFormData({ ...formData, categories })}
      />

      <div className="flex items-center gap-4 flex-wrap">
        <label className="font-semibold">Status</label>
        <select
          value={formData.status}
          onChange={(e) =>
            setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })
          }
          className="border rounded px-3 py-2"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
          />
          Featured Post
        </label>

        <label className="flex items-center gap-2">
          <span className="font-semibold">Weight</span>
          <input
            type="number"
            className="border rounded px-2 py-1 w-20"
            value={formData.weight || 0}
            onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
          />
        </label>
      </div>

      <ImageUploader
        imageUrl={formData.featuredImage || ''}
        onChange={(url) => setFormData({ ...formData, featuredImage: url })}
      />

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {isEdit ? 'Update Post' : 'Create Post'}
        </button>
      </div>
    </form>
  );
}
