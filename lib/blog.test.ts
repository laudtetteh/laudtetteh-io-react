import { describe, expect, it } from 'vitest';
import { STATIC_BLOG_POSTS } from '@/data/blogPosts';
import { mergePublishedPosts } from './blog';
import type { PostData } from '@/types/blog';

const body = JSON.stringify(STATIC_BLOG_POSTS);

describe('static blog posts', () => {
  it('publishes at least three stream-A posts with unique featured images', () => {
    expect(STATIC_BLOG_POSTS).toHaveLength(3);
    expect(STATIC_BLOG_POSTS.every(post => post.status === 'published')).toBe(true);

    const featuredImages = STATIC_BLOG_POSTS.map(post => post.featuredImage);
    expect(new Set(featuredImages).size).toBe(featuredImages.length);
    for (const featuredImage of featuredImages) {
      expect(featuredImage).toMatch(/^\/images\/writing\/.+\.png$/);
    }
  });

  it('keeps public-copy guardrails out of static posts', () => {
    expect(body).not.toMatch(/\b(?:GUS|BWEB|W)-?\d{4,}\b/i);
    expect(body).not.toMatch(/@salesforce\.com|@tableau\.com/i);
    expect(body).not.toMatch(/\bFounder\b|runs?\s+a\s+business|operates?\s+a\s+business/i);
    expect(body).not.toMatch(/\bSenior\b|\bStaff\b|\bPrincipal\b/);
    expect(body).not.toMatch(/Skills?:[^.]*\b(?:Redis|Memcache|Acquia|Optimizely|OneTrust|TypeScript)\b/i);
  });

  it('deduplicates API posts by slug while keeping static posts first', () => {
    const apiPosts: PostData[] = [
      {
        ...STATIC_BLOG_POSTS[0],
        title: 'API duplicate should not replace static content',
      },
      {
        title: 'Older API Post',
        slug: 'older-api-post',
        summary: 'A backend-provided post.',
        content: { html: '<p>Backend content.</p>' },
        status: 'published',
        categories: ['Tech & Projects'],
        date_published: '2024-01-01T00:00:00.000Z',
        featured: false,
      },
    ];

    const merged = mergePublishedPosts(apiPosts);
    expect(merged.filter(post => post.slug === STATIC_BLOG_POSTS[0].slug)).toHaveLength(1);
    expect(merged[0].slug).toBe(STATIC_BLOG_POSTS[0].slug);
    expect(merged.map(post => post.slug)).toContain('older-api-post');
  });
});
