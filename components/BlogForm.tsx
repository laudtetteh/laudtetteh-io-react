import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';

import BlogMetaFields from './blog/BlogMetaFields';
import BlogContentEditor from './blog/BlogContentEditor';
import BlogImageUploader from './blog/BlogImageUploader';
import BlogActions from './blog/BlogActions';
import BlogPreview from './blog/BlogPreview';

import type { BlogPostFormData } from '@/types/blog';
import { createPost, updatePost, uploadImage } from '@/lib/api';

interface BlogFormProps {
  initialData?: BlogPostFormData;
  isEditing?: boolean;
}

export default function BlogForm({ initialData, isEditing = false }: BlogFormProps) {
  const [formData, setFormData] = useState<BlogPostFormData>(
    initialData || {
      title: '',
      slug: '',
      summary: '',
      content: { html: '' },
    },
  );

  const [preview, setPreview] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  // Handle image upload to S3
  async function handleImageUpload() {
    if (!image) return;
    setUploading(true);
    const token = localStorage.getItem('token') || '';
    try {
      const imageUrl = await uploadImage(image, token);
      setFormData((prev) => ({
        ...prev,
        content: { html: prev.content.html + `\n\n<img src="${imageUrl}" alt="uploaded image" />` },
      }));
    } catch (e) {
      alert('Image upload failed');
    } finally {
      setUploading(false);
    }
  }

  // Submit form
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem('token') || '';
    try {
      if (isEditing) {
        await updatePost(formData.slug, formData, token);
      } else {
        await createPost(formData, token);
      }
      router.push('/admin');
    } catch (e) {
      alert('Error saving post');
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <BlogMetaFields
          title={formData.title}
          slug={formData.slug}
          summary={formData.summary}
          isEditing={isEditing}
          onChange={(field, value) => {
            if (field === 'content') {
              setFormData((prev) => ({ ...prev, content: { html: value } }));
            } else {
              setFormData((prev) => ({ ...prev, [field]: value }));
            }
          }}
        />
        <BlogContentEditor
          content={formData.content}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              content: { html: typeof value === 'string' ? value : value.html },
            }))
          }
        />
        <BlogImageUploader
          uploading={uploading}
          onImageChange={setImage}
          onUpload={handleImageUpload}
          disabled={!image}
        />
        <BlogActions
          isEditing={isEditing}
          preview={preview}
          onPreviewToggle={() => setPreview((p) => !p)}
        />
      </form>

      {preview && (
        <BlogPreview title={formData.title} summary={formData.summary} content={formData.content} />
      )}
    </div>
  );
}
