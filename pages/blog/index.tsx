import React, { useEffect, useState } from 'react';
import type { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import BlogLayout from '@/components/redesign/blog/BlogLayout';
import CategoryFilter from '@/components/redesign/blog/CategoryFilter';
import PostCard from '@/components/redesign/blog/PostCard';
import Pagination from '@/components/redesign/blog/Pagination';
import { getAllPublishedPosts } from '@/lib/blog';
import type { PostData } from '@/types/blog';

// Blog content changes more often than a static page but not so often that
// visitors need second-by-second freshness — matches the precedent set by
// the redesign's own POSTS_REVALIDATE_SECONDS (`pages/redesign.tsx`).
const BLOG_INDEX_REVALIDATE_SECONDS = 3600; // 1 hour
const POSTS_PER_PAGE = 6;

interface BlogIndexProps {
  posts: PostData[];
}

const BlogIndex: NextPage<BlogIndexProps> = ({ posts }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' && localStorage.getItem('token');
    setLoggedIn(Boolean(token));
  }, []);

  // Get all unique categories from posts
  const allCategories = ['All', ...Array.from(new Set(posts.flatMap(post => post.categories)))];

  // On mount, set category from URL param if present. Also resets pagination —
  // otherwise switching to a category with fewer posts while on page 2+ can
  // slice past the end of the filtered array and show "no posts found" even
  // though matching posts exist, until the page is manually reset.
  useEffect(() => {
    if (!router.isReady) return;
    const urlCategory = router.query.category;
    if (typeof urlCategory === 'string' && allCategories.includes(urlCategory)) {
      setSelectedCategory(urlCategory);
    } else {
      setSelectedCategory('All');
    }
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query.category, posts]);

  // Filter published posts by category
  const publishedPosts = posts.filter(p => p.status === 'published');
  const filteredPosts =
    selectedCategory === 'All' ? publishedPosts : publishedPosts.filter(post => post.categories.includes(selectedCategory));

  // Sort by date_published (newest first)
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const aDate = new Date(a.date_published || a.date || 0).getTime();
    const bDate = new Date(b.date_published || b.date || 0).getTime();
    return bDate - aDate;
  });

  // Pagination
  const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = sortedPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <BlogLayout
      title="Blog | Laud Tetteh"
      description="Read the latest posts from Laud Tetteh on software, tech, and more."
      path="/blog"
    >
      <div className="mb-16 md:mb-24">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Blog</h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
          Posts on the projects, tools, and lessons I&apos;m working through.
        </p>

        <div className="mt-8">
          <CategoryFilter categories={allCategories} selectedCategory={selectedCategory} />
        </div>

        {paginatedPosts.length > 0 ? (
          <div key={`${selectedCategory}-${currentPage}`} className="mt-10 animate-fade-in space-y-8 motion-reduce:animate-none">
            {paginatedPosts.map(post => (
              <PostCard key={post.slug} post={post} loggedIn={loggedIn} />
            ))}
          </div>
        ) : (
          <p
            key={`${selectedCategory}-${currentPage}`}
            className="mt-10 animate-fade-in rounded-lg border border-dashed border-slate-200 px-6 py-10 text-center text-sm text-slate-600 motion-reduce:animate-none dark:border-slate-800 dark:text-slate-400"
          >
            {selectedCategory === 'All' ? 'No posts available yet.' : `No posts found in "${selectedCategory}" category.`}
          </p>
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </BlogLayout>
  );
};

export const getStaticProps: GetStaticProps<BlogIndexProps> = async () => {
  let posts: PostData[] = [];
  try {
    posts = await getAllPublishedPosts();
  } catch (err) {
    console.error(err);
  }

  return {
    props: { posts },
    revalidate: BLOG_INDEX_REVALIDATE_SECONDS,
  };
};

export default BlogIndex;
