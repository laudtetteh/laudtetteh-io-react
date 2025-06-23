import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import BlogHeader from '@/components/BlogHeader';

type BlogPost = {
  title: string;
  summary: string;
  date: string;
  date_published?: string;
  featuredImage: string;
  categories: string[];
  slug: string;
  status: string;
  featured?: boolean;
  weight?: number;
};

const BlogIndex: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/posts`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPosts(data);
        else console.error("❌ Unexpected blog response:", data);
      });

    const token = typeof window !== 'undefined' && localStorage.getItem('token');
    setLoggedIn(Boolean(token));
  }, []);

  function formatDate(dateString?: string) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  // Get all unique categories from posts
  const allCategories = ['All', ...Array.from(new Set(posts.flatMap(post => post.categories)))];

  // Filter published posts by category
  const publishedPosts = posts.filter(p => p.status === "published");
  const filteredPosts = selectedCategory === 'All' 
    ? publishedPosts 
    : publishedPosts.filter(post => post.categories.includes(selectedCategory));

  // Sort by date_published (newest first)
  const sortedPosts = filteredPosts.sort((a, b) => {
    const aDate = new Date(a.date_published || a.date).getTime();
    const bDate = new Date(b.date_published || b.date).getTime();
    return bDate - aDate;
  });

  // Pagination
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = sortedPosts.slice(startIndex, startIndex + postsPerPage);

  return (
    <>
      <Head>
        <title>Blog | Laud Tetteh</title>
        <meta name="description" content="Read the latest posts from Laud Tetteh on software, tech, and more." />
      </Head>
      <BlogHeader />
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-12">Blog</h1>

        {/* Category Navigation */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-8 border-b border-gray-200">
            {allCategories.map(category => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className={`pb-4 text-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Posts List */}
        <div className="mb-12 bg-white border border-gray-200" style={{ borderRadius: 0, padding: '0 2rem' }}>
          {paginatedPosts.map((post, idx) => {
            const displayDate = post.date_published || post.date;
            const formattedDate = formatDate(displayDate);
            return (
              <div key={post.slug}>
                <div className="flex flex-col md:flex-row items-center py-10" style={{ minHeight: 192, borderBottom: '1px solid #d9d9d9'}}>
                  {/* Image */}
                  <div className="w-full md:w-1/3 h-48 overflow-hidden bg-gray-100 flex items-center justify-center" style={{ borderRadius: 0 }}>
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover" style={{ borderRadius: 0, objectFit: 'cover', objectPosition: 'center' }}
                    />
                  </div>
                  {/* Content */}
                  <div className="w-full md:w-2/3 flex flex-col justify-center h-full md:pl-10 mt-6 md:mt-0">
                    {/* Date */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 font-medium">{formattedDate}</span>
                    </div>
                    {/* Categories */}
                    {post.categories && post.categories.length > 0 && (
                      <div className="mb-2 flex flex-wrap gap-2">
                        {post.categories.map((cat) => (
                          <span key={cat} className="bg-gray-100 text-gray-800 text-xs px-2 py-1" style={{ borderRadius: 0, fontWeight: 500, letterSpacing: 0.5 }}>{cat}</span>
                        ))}
                      </div>
                    )}
                    {/* Title as Link */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ letterSpacing: 0 }}>
                      <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                        {post.title}
                      </Link>
                    </h2>
                    {/* Summary */}
                    <p className="text-gray-600 text-base mb-4">{post.summary}</p>
                    {/* Read More Button */}
                    <div className="arlo_tm_button" style={{ width: 'auto', display: 'inline-block' }}>
                      <a href={`/blog/${post.slug}`} style={{ textTransform: 'uppercase', fontWeight: 700, fontSize: 14, borderRadius: 0, letterSpacing: 1 }}>
                        <span className="back">Read More</span>
                        <span className="front">Read More</span>
                      </a>
                    </div>
                    {/* Admin Edit Link */}
                    {loggedIn && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <Link
                          href={`/admin/edit/${post.slug}`}
                          className="text-blue-500 text-sm underline hover:text-blue-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Edit
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
                {/* Divider except after last post */}
                {idx !== paginatedPosts.length - 1 && (
                  <div className="border-t border-gray-200 w-full" />
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`w-10 h-10 rounded ${
                    currentPage === pageNumber
                      ? ''
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={currentPage === pageNumber ? { background: '#999999', color: '#fff' } : {}}
                >
                  {pageNumber}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              Next
            </button>
          </div>
        )}

        {/* No Posts Message */}
        {paginatedPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {selectedCategory === 'All' 
                ? 'No posts available yet.' 
                : `No posts found in "${selectedCategory}" category.`
              }
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default BlogIndex;
