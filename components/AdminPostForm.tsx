'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useFlashMessage } from '@/lib/useFlashMessage';
import { useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { Extension, type JSONContent } from '@tiptap/core';
import { Plugin } from 'prosemirror-state';
import { uploadImage, getPost } from '@/lib/api';
import type { PostData } from '@/types/blog';
import PostMetaFields from './admin/PostMetaFields';
import PostContentEditor from './admin/PostContentEditor';
import PostOptions from './admin/PostOptions';
import PostImageUploader from './admin/PostImageUploader';
import PostActions from './admin/PostActions';
import CodeBlock from '@tiptap/extension-code-block';
import HardBreak from '@tiptap/extension-hard-break';
import sanitizeHtml from 'sanitize-html';
import { generateJSON } from '@tiptap/html';

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
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
  const [editorContent, setEditorContent] = useState<{ html: string }>({ html: '' });
  const [slugReadOnly, setSlugReadOnly] = useState(true);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const lastModeRef = useRef<boolean>(htmlMode);
  const lastContentRef = useRef<string>(editorContent.html);

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
    setSlugReadOnly(true);
    setSlugManuallyEdited(false);
  }, [initialData]);

  // Auto-generate slug from title unless manually edited
  useEffect(() => {
    if (!formData) return;
    if (!slugManuallyEdited) {
      setFormData(f => f ? { ...f, slug: slugify(f.title) } : f);
    }
  }, [formData?.title]);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData?.title.trim()) errs.title = 'Title is required';
    if (!formData?.slug.trim()) errs.slug = 'Slug is required';
    if (!/^[a-z0-9-]+$/.test(formData?.slug || '')) errs.slug = 'Slug must be lowercase letters, numbers, or hyphens only';
    if (!formData?.summary.trim()) errs.summary = 'Summary is required';
    if (!editorContent.html.trim()) errs.content = 'Content is required';
    return errs;
  };

  // Prepare and log raw and sanitized HTML before initializing the editor
  const rawHtml = initialData?.content?.html || '';
  const sanitizedHtml = sanitizeHtml(rawHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'code', 'ul', 'ol', 'li', 'blockquote', 'p', 'strong', 'em', 'a', 'img', 'br', 'hr'
    ]),
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      '*': ['class', 'style'],
    },
  });
  
  // For editor initialization, convert HTML to ProseMirror JSON
  let initialContent: string | JSONContent = '';
  if (initialData && sanitizedHtml) {
    try {
      // Use generateJSON to parse HTML to ProseMirror JSON for editor initialization
      initialContent = generateJSON(sanitizedHtml, [
        StarterKit.configure(),
        Underline,
        Image.configure({ inline: true, allowBase64: true }),
        Link.configure({ openOnClick: false }),
        Placeholder.configure({ placeholder: 'Write your post content here...' }),
        CharacterCount.configure(),
        CodeBlock,
        HardBreak,
      ]) as JSONContent;
    } catch {
      // If generateJSON fails, use empty string - editor will handle it gracefully
      initialContent = '';
    }
  }

  // Always initialize the editor, even if initialData is not present
  const editor = useEditor({
    content: initialContent,
    extensions: [
      StarterKit.configure(),
      Underline,
      Image.configure({ inline: true, allowBase64: true }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Write your post content here...' }),
      CharacterCount.configure(),
      CodeBlock,
      HardBreak,
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
    onUpdate({ editor }: { editor: Editor }) {
      const html = editor.getHTML();
      setEditorContent({ html });
    },
  });

  // Set editorContent state only after initialData is loaded
  useEffect(() => {
    if (initialData) {
      setEditorContent(initialData.content || { html: '' });
    }
  }, [initialData]);

  // Hydrate editor with latest HTML when switching from HTML to Visual mode
  useEffect(() => {
    if (
      editor &&
      lastModeRef.current === true &&
      htmlMode === false &&
      editorContent.html !== lastContentRef.current
    ) {
      const sanitized = sanitizeHtml(editorContent.html, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h1', 'h2', 'pre', 'code']),
        allowedAttributes: false,
      });
      editor.commands.focus();
      editor.commands.setContent(sanitized || '', false);
      lastContentRef.current = editorContent.html;
    } else if (
      editor &&
      lastModeRef.current === false &&
      htmlMode === true
    ) {
      // When switching from Visual to HTML, ensure the textarea shows current editor content
      const currentHtml = editor.getHTML();
      if (currentHtml !== editorContent.html) {
        setEditorContent({ html: currentHtml });
        lastContentRef.current = currentHtml;
      }
    }
    lastModeRef.current = htmlMode;
  }, [htmlMode, editor, editorContent.html]);

  async function uploadAndInsert(file: File) {
    const token = localStorage.getItem('token');
    try {
      const file_url = await uploadImage(file, token || '');
      editor?.chain().focus().setImage({ src: file_url }).run();
    } catch {
      alert('Image upload failed');
    }
  }

  const handleMetaChange = (field: string, value: string) => {
    if (!formData) return;
    if (field === 'slug') {
      setSlugManuallyEdited(true);
      setFormData({ ...formData, slug: slugify(value) });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Uniqueness check for slug
    if (!isEdit) {
      try {
        await getPost(formData.slug);
        setErrors({ ...validationErrors, slug: 'Slug already exists. Please choose a unique one.' });
        pushMessage('Slug already exists. Please choose a unique one.', 'top-center', 'error');
        return;
      } catch {
        // Not found is expected for new post
      }
    }

    const updated = {
      ...formData,
      content: { html: editorContent.html },
      categories: formData.categories.length > 0 ? formData.categories : ['uncategorized'],
    };
    onSubmit(updated);
  };

  const handleDelete = async () => {
    if (!formData?.slug) return;
    try {
      // Call your delete API (assume deletePost exists in lib/api)
      await import('@/lib/api').then(mod => mod.deletePost(formData.slug));
      pushMessage('Post deleted successfully', 'top-center', 'success');
      router.push('/admin');
    } catch {
      pushMessage('Failed to delete post', 'top-center', 'error');
    }
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
        onChange={handleMetaChange}
        slugReadOnly={slugReadOnly}
        onSlugEditClick={() => setSlugReadOnly(false)}
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

      <PostActions isEdit={isEdit} slug={formData.slug} onDelete={handleDelete} />
    </form>
  );
}
