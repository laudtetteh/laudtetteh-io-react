'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useFlashMessage } from '@/lib/useFlashMessage';
import CategoryPicker from './CategoryPicker';
import ImageUploader from './shared/ImageUploader';
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
import { uploadImage, getPost } from '@/lib/api';
import type { PostData } from '@/types/blog';
import PostMetaFields from './admin/PostMetaFields';
import PostContentEditor from './admin/PostContentEditor';
import PostOptions from './admin/PostOptions';
import PostImageUploader from './admin/PostImageUploader';
import PostActions from './admin/PostActions';

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
  const [editorContent, setEditorContent] = useState<{ html: string }>({ html: '' });

  useEffect(() => {
    if (initialData) {
      const fullData: PostData = {
        title: initialData.title || '',
        slug: initialData.slug || '',
        summary: initialData.summary || '',
        content: initialData.content || { html: '' },
        categories: initialData.categories || [],
        status: initialData.status || 'draft',
        featured: initialData.featured || false,
        featuredImage: initialData.featuredImage || '',
        weight: initialData.weight ?? 0,
        date_published: initialData.date_published,
      };
      setFormData(fullData);
      setEditorContent(fullData.content || { html: '' });
    } else {
      setFormData({
        title: '',
        slug: '',
        summary: '',
        content: { html: '' },
        categories: [],
        status: 'draft',
        featured: false,
        featuredImage: '',
        weight: 0,
        date_published: new Date().toISOString(),
      });
      setEditorContent({ html: '' });
    }
  }, [initialData]);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData?.title.trim()) errs.title = 'Title is required';
    if (!formData?.slug.trim()) errs.slug = 'Slug is required';
    if (!/^[a-z0-9-]+$/.test(formData?.slug || '')) errs.slug = 'Slug must be lowercase letters, numbers, or hyphens only';
    if (!formData?.summary.trim()) errs.summary = 'Summary is required';
    if (!editorContent.html.trim()) errs.content = 'Content is required';
    return errs;
  };

  const editor = useEditor({
    content: editorContent.html,
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
      setEditorContent({ html });
    },
  });

  useEffect(() => {
    if (editor && formData) {
      editor.commands.setContent(formData.content.html || '');
    }
  }, [editor, formData]);

  async function uploadAndInsert(file: File) {
    const token = localStorage.getItem('token');
    try {
      const file_url = await uploadImage(file, token || '');
      editor?.chain().focus().setImage({ src: file_url }).run();
    } catch (e) {
      alert('Image upload failed');
    }
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
      content: { html: editorContent.html },
      categories: formData.categories.length > 0 ? formData.categories : ['uncategorized'],
    };

    if (!isEdit) {
      try {
        await getPost(updated.slug);
        pushMessage('Slug already exists. Please choose a unique one.', 'top-center', 'error');
        return;
      } catch (e) {
        // Not found is expected for new post
      }
    }

    onSubmit(updated);
  };

  if (!formData) return <p className="text-center py-10">Loading form...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto py-10">
      {/* Title, Slug, Summary */}
      <PostMetaFields
        title={formData.title}
        slug={formData.slug}
        summary={formData.summary}
        errors={errors}
        onChange={(field, value) => setFormData({ ...formData, [field]: value })}
        />

      {/* Content Editor */}
      <PostContentEditor
        editor={editor}
        editorContent={editorContent}
        htmlMode={htmlMode}
        setHtmlMode={setHtmlMode}
        errors={errors}
        setEditorContent={setEditorContent}
      />

      {/* Categories, Status, Featured, Weight */}
      <PostOptions
        categories={formData.categories}
        status={formData.status}
        featured={formData.featured}
        weight={formData.weight || 0}
        date_published={formData.date_published}
        onChange={(field, value) => setFormData({ ...formData, [field]: value })}
          />

      <PostImageUploader
        imageUrl={formData.featuredImage || ''}
        onChange={(url) => setFormData({ ...formData, featuredImage: url })}
      />

      <PostActions isEdit={isEdit} />
    </form>
  );
}
