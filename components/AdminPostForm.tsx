'use client';

import { useEffect, useState, useRef } from 'react';
import { useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';
import { CharacterCount } from '@tiptap/extension-character-count';
import { Extension } from '@tiptap/core';
import { Plugin } from 'prosemirror-state';
import { Underline } from '@tiptap/extension-underline';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';

import PostMetaFields from './admin/PostMetaFields';
import PostContentEditor from './admin/PostContentEditor';
import PostOptions from './admin/PostOptions';
import PostImageUploader from './admin/PostImageUploader';
import PostActions from './admin/PostActions';

import type { PostData } from '@/types/blog';
import { uploadImage, getPost } from '@/lib/api';
import { useFlashMessage } from '@/lib/useFlashMessage';

function hasHtmlField(content: unknown): content is { html: string } {
  return (
    typeof content === 'object' &&
    content !== null &&
    'html' in content &&
    typeof (content as { html: unknown }).html === 'string'
  );
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
  const { pushMessage } = useFlashMessage();

  const [formData, setFormData] = useState<PostData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    summary: initialData?.summary || '',
    content:
      typeof initialData?.content === 'object' &&
      initialData?.content !== null &&
      'html' in initialData.content
        ? initialData.content
        : { html: initialData?.content || '' },
    categories: initialData?.categories || [],
    status: initialData?.status || 'draft',
    featured: initialData?.featured || false,
    featuredImage: initialData?.featuredImage || '',
    weight: initialData?.weight ?? 0,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [htmlMode, setHtmlMode] = useState(false);
  const didMount = useRef(false);

  useEffect(() => {
    if (!didMount.current && initialData) {
      setFormData({
        title: initialData.title || '',
        slug: initialData.slug || '',
        summary: initialData.summary || '',
        content:
          typeof initialData.content === 'object' &&
          initialData.content !== null &&
          'html' in initialData.content
            ? initialData.content
            : { html: initialData.content || '' },
        categories: initialData.categories || [],
        status: initialData.status || 'draft',
        featured: initialData.featured || false,
        featuredImage: initialData.featuredImage || '',
        weight: initialData.weight ?? 0,
      });
      didMount.current = true;
    }
  }, [initialData]);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    if (!formData.slug.trim()) errs.slug = 'Slug is required';
    if (!/^[a-z0-9-]+$/.test(formData.slug))
      errs.slug = 'Slug must be lowercase letters, numbers, or hyphens only';
    if (!formData.summary.trim()) errs.summary = 'Summary is required';
    if (!formData.content.html.trim()) errs.content = 'Content is required';
    return errs;
  };

  const editor = useEditor({
    content: hasHtmlField(formData.content) ? formData.content.html : formData.content,
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
      setFormData((prev) => ({ ...prev, content: { html } }));
    },
  });

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

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Normalize content to always be an object { html: string }
    const normalizedContent =
      typeof formData.content === 'string'
        ? { html: formData.content }
        : hasHtmlField(formData.content)
          ? formData.content
          : { html: '' };

    const updated = {
      ...formData,
      content: normalizedContent,
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

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6 py-10">
      {/* Title, Slug, Summary */}
      <PostMetaFields
        title={formData.title}
        slug={formData.slug}
        summary={formData.summary}
        errors={errors}
        onChange={(field, value) => setFormData((prev) => ({ ...prev, [field]: value }))}
      />

      {/* Content Editor */}
      <PostContentEditor
        editor={editor}
        editorContent={formData.content}
        htmlMode={htmlMode}
        setHtmlMode={setHtmlMode}
        errors={errors}
        setEditorContent={(content) => setFormData((prev) => ({ ...prev, content }))}
      />

      {/* Categories, Status, Featured, Weight */}
      <PostOptions
        categories={formData.categories}
        status={formData.status}
        featured={formData.featured}
        weight={formData.weight ?? 0}
        onChange={(field, value) => setFormData((prev) => ({ ...prev, [field]: value }))}
      />

      {/* Featured Image */}
      <PostImageUploader
        imageUrl={formData.featuredImage || ''}
        onChange={(url: string) => setFormData((prev) => ({ ...prev, featuredImage: url }))}
      />

      {/* Submit Button */}
      <PostActions isEdit={isEdit} />
    </form>
  );
}
